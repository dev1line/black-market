'use client';

import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';

export function useGetNftCollectionTokens(
  collectionId: number,
  walletAddress?: string
) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['nft-tokens', collectionId, walletAddress],
    queryFn: async () => {
      if (!trnApi) {
        console.log('Missing trnApi or walletAddress');
        return;
      }

      const collectionInfo = await trnApi.query.nft.collectionInfo(
        collectionId
      );

      console.log('collectionInfo', collectionInfo.toHuman());

      const info = collectionInfo.toHuman() as unknown as {
        nextSerialNumber: { toNumber: () => number };
      };

      console.log('info nft collection tokens', info);

      const collectionTokens = info?.nextSerialNumber?.toNumber() - 1;

      const tokenInfo = collectionTokens
        ? await Promise.all(
            Array.from([...new Array(collectionTokens)]).map(
              async (_, index) => {
                const token = await trnApi.query.nft.tokenInfo([
                  collectionId,
                  index,
                ]);
                const info = token.toHuman() as unknown as {
                  tokenName: string;
                  ownedTokens: [
                    string,
                    { freeBalance: string; reservedBalance: string }
                  ][];
                };

                const ownedTokens = walletAddress
                  ? info?.ownedTokens.find(owned => {
                      return (
                        owned[0].toLowerCase() === walletAddress.toLowerCase()
                      );
                    })
                  : null;

                return {
                  id: index,
                  tokenName: info?.tokenName,
                  reservedBalance: ownedTokens
                    ? ownedTokens?.[1].reservedBalance
                    : null,
                  freeBalance: ownedTokens
                    ? ownedTokens?.[1].freeBalance
                    : null,
                };
              }
            )
          )
        : [];

      return tokenInfo ?? null;
    },
    enabled: !!trnApi && !!collectionId,
    // refetchInterval: 30000,
  });
}
