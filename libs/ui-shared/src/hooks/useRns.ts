'use client';

import type { FutureverseAuthClient } from '@futureverse/auth';
import { getAddressFromRns, getRnsFromAddress } from '../lib/rns';
import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';
import { useConfig } from 'wagmi';

export const useRnsResolveRns = (
  input: string,
  authClient: FutureverseAuthClient
) => {
  const wagmiConfig = useConfig();
  const chainId = authClient.config.chainId;
  const currentChain = wagmiConfig.chains.find(c => c.id === chainId);

  return useQuery({
    queryKey: ['rns', 'resolveRns', input, chainId],
    queryFn: async () => {
      if (!currentChain) {
        throw new Error('Chain not configured');
      }
      return getAddressFromRns(input, currentChain);
    },
    enabled:
      !!input &&
      input.endsWith('.root') &&
      !!chainId &&
      (chainId === 7672 || chainId === 7668),
    refetchInterval: 0,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export const useRnsResolveAddress = (
  input: string,
  authClient: FutureverseAuthClient
) => {
  const wagmiConfig = useConfig();
  const chainId = authClient.config.chainId;
  const currentChain = wagmiConfig.chains.find(c => c.id === chainId);

  return useQuery({
    queryKey: ['rns', 'resolveAddress', input, chainId],
    queryFn: async () => {
      if (!currentChain) {
        throw new Error('Chain not configured');
      }
      return getRnsFromAddress(input, currentChain);
    },
    enabled:
      !!input &&
      input.startsWith('0x') &&
      !!currentChain &&
      (currentChain.id === 7672 || currentChain.id === 7668),
    refetchInterval: 0,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
