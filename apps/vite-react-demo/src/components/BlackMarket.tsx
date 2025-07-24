import { TransactionDetails, useIsMounted } from '@fv-sdk-demos/ui-shared';
import {
  ViewAssets,
  ViewAssetsFromGame,
} from '../../../../libs/ui-shared/src/components/ViewAssetComps';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../../../../libs/ui-shared/src/hooks/useRootStore';
import { useEffect } from 'react';

export default function BlackMarket() {
  const isMounted = useIsMounted();

  const { userSession } = useAuth();
  const { gas, resetState } = useRootStore(state => state);

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
      <h1>View Assets on your wallet:</h1>

      <div className="grid grid-flow-col grid-cols-2 gap-4 w-full">
        <div className="w-full">
          <ViewAssets />
        </div>
        <div className="w-full">
          <ViewAssetsFromGame />
        </div>
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
