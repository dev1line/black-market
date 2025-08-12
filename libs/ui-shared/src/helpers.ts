import { NetworkName } from '@therootnetwork/api';

export const NETWORK_PROVIDER: Record<
  NetworkName,
  { ws: `ws${string}`; http: `http${string}` }
> = {
  root: {
    ws: 'wss://root.rootnet.live/ws',
    http: 'https://root.rootnet.live',
  },
  porcini: {
    ws: 'wss://porcini.rootnet.app/ws',
    http: 'https://porcini.rootnet.app',
  },
  'sprout-1': {
    ws: 'wss://porcini.devnet.rootnet.app/ws',
    http: 'https://porcini.devnet.rootnet.app',
  },
  'sprout-2': {
    ws: 'wss://porcini.devnet.rootnet.app/ws',
    http: 'https://porcini.devnet.rootnet.app',
  },
};

export const ASSET_DECIMALS: Record<number, number> = {
  1: 6,
  2: 6,
  3172: 18,
  17508: 18,
};

/**
 * Helper function to handle API calls with automatic token refresh
 * @param apiCall - Function that makes the API call
 * @param refreshTokenFn - Function to refresh the access token
 * @param options - Configuration options
 * @returns Promise with the API response
 */
export const withTokenRefresh = async <T>(
  apiCall: (accessToken: string) => Promise<T>,
  refreshTokenFn: (
    refreshToken: string
  ) => Promise<{ accessToken: string; refreshToken: string }>,
  options: {
    refreshToken: string;
    onTokenRefreshed?: (newAccessToken: string) => void;
  }
): Promise<T> => {
  try {
    // Get current access token
    let accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    try {
      // First attempt with current token
      return await apiCall(accessToken);
    } catch (error: any) {
      // Check if it's a 401/400 error (token expired)
      if (
        error?.status === 401 ||
        error?.status === 400 ||
        error?.response?.status === 401 ||
        error?.response?.status === 400
      ) {
        try {
          // Try to refresh the token
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshTokenFn(options.refreshToken);

          // Store the new token
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          // Call the callback if provided
          if (options.onTokenRefreshed) {
            options.onTokenRefreshed(newAccessToken);
          }

          // Retry the API call with new token
          return await apiCall(newAccessToken);
        } catch (refreshError) {
          throw new Error('Failed to refresh access token');
        }
      }

      // If it's not a token error, re-throw
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Helper function to create a fetch wrapper with automatic token refresh
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @param refreshTokenFn - Function to refresh the access token
 * @returns Promise with the fetch response
 */
export const fetchWithTokenRefresh = async (
  url: string,
  options: RequestInit = {},
  refreshTokenFn: (
    refreshToken: string
  ) => Promise<{ accessToken: string; refreshToken: string }>
): Promise<Response> => {
  return withTokenRefresh(
    async (accessToken: string) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error: any = new Error('Request failed');
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    },
    refreshTokenFn,
    {
      refreshToken: localStorage.getItem('refreshToken') || '',
      // onTokenRefreshed: newAccessToken => {
      //   // Update refresh token if it was also returned
      //   // This depends on your refresh token API response
      //   localStorage.setItem('accessToken', newAccessToken);
      // },
    }
  );
};
