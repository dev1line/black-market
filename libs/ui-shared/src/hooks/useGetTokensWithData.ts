'use client';
import '@therootnetwork/api-types';

import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';
import { useGetSftCollectionTokens } from './useGetSftCollectionTokens';
import { useEffect, useMemo } from 'react';

export function useGetTokensWithData(
  walletAddress: string,
  collectionId: number,
  assetType?: string
) {
  const { trnApi } = useTrnApi();

  // Move hook call to top level - this is the correct way
  const { data: tokenSft, isSuccess: tokenSftSuccess } =
    useGetSftCollectionTokens(collectionId, walletAddress);

  // Tạo một key duy nhất cho tokenSft để theo dõi thay đổi
  const tokenSftKey = useMemo(() => {
    if (!tokenSft) return null;
    // Tạo hash đơn giản từ dữ liệu tokenSft để theo dõi thay đổi
    return JSON.stringify(
      tokenSft.map(token => ({
        id: token.id,
        freeBalance: token.freeBalance,
        reservedBalance: token.reservedBalance,
      }))
    );
  }, [tokenSft]);

  const query = useQuery({
    queryKey: ['tokens', walletAddress, collectionId, assetType, tokenSftKey],
    queryFn: async ({ pageParam = 0 }) => {
      if (!trnApi || !walletAddress) {
        console.log('Missing trnApi or walletAddress');
        return {
          tokens: [],
          metadataScheme: null,
          tokenInfos: [],
          nextCursor: 0,
          hasMore: false,
        };
      }

      const collectionInfo =
        assetType === 'ERC1155'
          ? await trnApi.query.sft.sftCollectionInfo(collectionId)
          : await trnApi.query.nft.collectionInfo(collectionId);
      const collectionInfoHuman = collectionInfo.toHuman();

      const metadataScheme =
        collectionInfoHuman &&
        typeof collectionInfoHuman === 'object' &&
        'metadataScheme' in collectionInfoHuman
          ? (collectionInfoHuman as any).metadataScheme
          : null;

      const tokens = await trnApi.rpc.nft.ownedTokens(
        collectionId,
        walletAddress,
        pageParam,
        1000
      );

      // returns [0] => nextCursor, [1] => totalCount, [2] => ownedTokens
      const tokensJson = tokens.toJSON();
      const nextCursor = tokensJson[0] as number;
      const totalCount = tokensJson[1] as number;
      const ownedTokensNft = tokensJson[2] as number[];

      const ownedTokensSft =
        tokenSft
          ?.filter(
            record =>
              record?.freeBalance !== '0' && record?.freeBalance !== null
          )
          ?.map(token => token.id ?? 0) ?? [];

      const ownedTokens =
        assetType === 'ERC1155' ? ownedTokensSft : ownedTokensNft;

      const tokenInfos = await Promise.all(
        ownedTokens?.map(async token => {
          const data = await fetch(`${metadataScheme}${token}`);
          const dataJson = await data.json();
          return {
            ...dataJson,
            assetType: assetType,
            tokenId: token,
            collectionId: collectionId,
            quantity:
              assetType === 'ERC1155'
                ? tokenSft?.find(sft => sft.id === token)?.freeBalance ?? 0
                : 1,
            attributes:
              dataJson.attributes?.reduce(
                (acc: { [key: string]: string | number }, attr: any) => {
                  if (attr.trait_type && attr.value !== undefined) {
                    acc[attr.trait_type] = attr.value;
                  }
                  return acc;
                },
                {}
              ) || {},
          };
        })
      );

      return {
        tokens: ownedTokens ?? [],
        metadataScheme,
        tokenInfos: tokenInfos,
        hasNextPage: nextCursor > 0,
        totalCount: totalCount,
      };
    },
    enabled:
      !!trnApi &&
      !!walletAddress &&
      !!collectionId &&
      !!tokenSft &&
      tokenSftSuccess,
    // refetchInterval: 30000,
  });

  // Refetch khi walletAddress thay đổi hoặc khi tokenSft thay đổi
  useEffect(() => {
    if (
      walletAddress &&
      walletAddress !== '' &&
      collectionId &&
      collectionId !== 0 &&
      tokenSftSuccess
    ) {
      query.refetch();
    }
  }, [walletAddress, collectionId, tokenSftKey, tokenSftSuccess]);

  return {
    ...query,
    data: query.data?.tokenInfos ?? [],
    hasNextPage: query.data?.hasNextPage ?? false,
    fetchNextPage: () => {
      return query.refetch();
    },
    refetch: () => {
      return query.refetch();
    },
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isRefetching: query.isRefetching,
    isStale: query.isStale,
    isFetched: query.isFetched,
  };
}
