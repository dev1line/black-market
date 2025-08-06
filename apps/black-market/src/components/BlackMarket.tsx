import { TransactionDetails, useIsMounted } from '@fv-sdk-demos/ui-shared';
import {
  ViewAssets,
  ViewAssetsFromGame,
} from '../../../../libs/ui-shared/src/components/ViewAssetComps';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../../../../libs/ui-shared/src/hooks/useRootStore';
import { useEffect } from 'react';

const characerCollectionId = import.meta.env.VITE_COLLECTION_CHARACTER_ID || '';
const equipmentCollectionId =
  import.meta.env.VITE_COLLECTION_EQUIPMENT_ID || '';
const stoneCollectionId = import.meta.env.VITE_COLLECTION_STONE_ID || '';
const assetControlled = [
  characerCollectionId,
  equipmentCollectionId,
  stoneCollectionId,
].filter(Boolean); // Filter out empty values

export default function BlackMarket() {
  const isMounted = useIsMounted();
  const { userSession } = useAuth();
  const { gas, resetState } = useRootStore(state => state);
  const publicKey = import.meta.env.VITE_PUBLIC_KEY || '';
  const formattedPublicKey = publicKey ? publicKey.replace(/\\n/g, '\n') : '';
  const GameServerUrl = import.meta.env.VITE_GAME_SERVER_URL || '';
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
    <div className="flex flex-col items-center justify-center w-full">
      <img src="/images/black-market/HeroBanner.png" alt="HeroBanner" />

      {/* <div className="grid grid-flow-col grid-cols-2 gap-4 w-full"> */}
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
  );
}
