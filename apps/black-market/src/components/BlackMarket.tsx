import { TransactionDetails, useIsMounted } from '@fv-sdk-demos/ui-shared';
import {
  ViewAssets,
  ViewAssetsFromGame,
} from '../../../../libs/ui-shared/src/components/ViewAssetComps';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../../../../libs/ui-shared/src/hooks/useRootStore';
import {
  useEffect,
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react';

const characerCollectionId = import.meta.env.VITE_COLLECTION_CHARACTER_ID || '';
const equipmentCollectionId =
  import.meta.env.VITE_COLLECTION_EQUIPMENT_ID || '';
const stoneCollectionId = import.meta.env.VITE_COLLECTION_STONE_ID || '';
const assetControlled = [
  characerCollectionId,
  equipmentCollectionId,
  stoneCollectionId,
].filter(Boolean); // Filter out empty values

// Context để quản lý việc refetch giữa các component
interface RefetchContextType {
  triggerViewAssetsRefetch: () => void;
  triggerViewAssetsFromGameRefetch: () => void;
  onViewAssetsRefetch: (callback: () => void) => void;
  onViewAssetsFromGameRefetch: (callback: () => void) => void;
}

const RefetchContext = createContext<RefetchContextType | null>(null);

export const useRefetchContext = () => {
  const context = useContext(RefetchContext);
  if (!context) {
    throw new Error('useRefetchContext must be used within RefetchProvider');
  }
  return context;
};

export default function BlackMarket() {
  const isMounted = useIsMounted();
  const { userSession } = useAuth();
  const { gas, resetState } = useRootStore(state => state);
  const publicKey = import.meta.env.VITE_PUBLIC_KEY || '';
  const formattedPublicKey = publicKey ? publicKey.replace(/\\n/g, '\n') : '';
  const GameServerUrl = import.meta.env.VITE_GAME_SERVER_URL || '';

  // State để lưu trữ callback functions
  const [viewAssetsRefetchCallback, setViewAssetsRefetchCallback] = useState<
    (() => void) | null
  >(null);
  const [
    viewAssetsFromGameRefetchCallback,
    setViewAssetsFromGameRefetchCallback,
  ] = useState<(() => void) | null>(null);

  // Functions để trigger refetch
  const triggerViewAssetsRefetch = useCallback(() => {
    if (viewAssetsRefetchCallback) {
      viewAssetsRefetchCallback();
    }
  }, [viewAssetsRefetchCallback]);

  const triggerViewAssetsFromGameRefetch = useCallback(() => {
    if (viewAssetsFromGameRefetchCallback) {
      viewAssetsFromGameRefetchCallback();
    }
  }, [viewAssetsFromGameRefetchCallback]);

  // Functions để đăng ký callback
  const onViewAssetsRefetch = useCallback((callback: () => void) => {
    setViewAssetsRefetchCallback(() => callback);
  }, []);

  const onViewAssetsFromGameRefetch = useCallback((callback: () => void) => {
    setViewAssetsFromGameRefetchCallback(() => callback);
  }, []);

  const refetchContextValue: RefetchContextType = {
    triggerViewAssetsRefetch,
    triggerViewAssetsFromGameRefetch,
    onViewAssetsRefetch,
    onViewAssetsFromGameRefetch,
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  if (!userSession) {
    return <h1>Sign in to interact with custom extrinsics</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <RefetchContext.Provider value={refetchContextValue}>
      <div className="flex flex-col items-center justify-center w-full">
        <img src="/images/black-market/HeroBanner.png" alt="HeroBanner" />

        <div
          className="flex inventory-container"
          style={{
            gap: '8px',
            marginTop: '8px',
          }}
        >
          <ViewAssets
            publicKey={formattedPublicKey}
            gameServerUrl={GameServerUrl}
            assetControlled={assetControlled}
          />
          <ViewAssetsFromGame
            publicKey={formattedPublicKey}
            gameServerUrl={GameServerUrl}
            assetControlled={assetControlled}
          />
        </div>
        <div className="auto-grid">
          {gas && (
            <div className="w-full">
              <TransactionDetails />
            </div>
          )}
        </div>
      </div>
    </RefetchContext.Provider>
  );
}
