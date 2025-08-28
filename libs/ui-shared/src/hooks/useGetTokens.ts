'use client';
import '@therootnetwork/api-types';

import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';
import { useGetSftCollectionTokens } from './useGetSftCollectionTokens';

export function useGetTokens(
  walletAddress: string,
  collectionId: number,
  assetType: string
) {
  const { trnApi } = useTrnApi();

  // Move hook call to top level - this is the correct way
  const { data: tokenSft } = useGetSftCollectionTokens(
    collectionId,
    walletAddress
  );

  return useQuery({
    queryKey: ['tokens', walletAddress, collectionId],
    queryFn: async () => {
      if (!trnApi || !walletAddress) {
        console.log('Missing trnApi or walletAddress');
        return;
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
        0,
        1000
      );

      const ownedTokensNft = tokens?.toJSON()[2] as number[];
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
      };
    },
    enabled: !!trnApi && !!walletAddress && !!collectionId,
    // refetchInterval: 30000,
  });
}
