import {
  ViewAssets,
  ViewAssetsFromGame,
} from '../../../../libs/ui-shared/src/components/ViewAssetComps';

export default function BlackMarket() {
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
    </div>
  );
}
