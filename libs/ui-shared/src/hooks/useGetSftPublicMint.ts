'use client';
import { useQuery } from '@tanstack/react-query';
import { useTrnApi } from '@futureverse/transact-react';
import { SeedPalletCommonUtilsPublicMintInformation } from '@polkadot/types/lookup';
import { Option } from '@polkadot/types';

export function useGetSftPublicMint(collectionId: number, tokenId: number) {
  const { trnApi } = useTrnApi();

  return useQuery({
    queryKey: ['public-mint-sft', collectionId, tokenId],
    queryFn: async () => {
      if (!trnApi || !collectionId || !tokenId) {
        console.log('Missing trnApi or collectionId or tokenId');
        return;
      }

      const publicMintInfo = (await trnApi.query.sft.publicMintInfo(
        collectionId,
        tokenId
      )) as Option<SeedPalletCommonUtilsPublicMintInformation>;
      console.log('publicMintInfo', publicMintInfo);
      const info = publicMintInfo?.unwrap();
      console.log('info', info);
      if (!info || typeof info !== 'object' || info === null) {
        return {
          enabled: false,
          pricingDetails: null,
        };
      }

      return {
        enabled: (info as any).enabled?.toHuman?.() ?? false,
        pricingDetails: (info as any).pricingDetails?.toJSON?.() ?? null,
      };
    },
    enabled: !!trnApi && !!collectionId && !!tokenId,
  });
}
