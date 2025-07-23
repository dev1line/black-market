import { useAuth } from '@futureverse/auth-react';
import { Divider } from '@futureverse/auth-ui';
import React from 'react';

const GameServerUrl =
  'https://seahorse-magnetic-officially.ngrok.app/api/animal-go/equip/';
const baseImgUrl =
  'https://purple-accused-porpoise-873.mypinata.cloud/ipfs/bafybeihbnrflh2rkyvtw652h6hjocyhocemi2o3kaqyxly3t3wajqhj6w4/';
const baseItemImgUrl =
  'https://purple-accused-porpoise-873.mypinata.cloud/ipfs/bafybeiepijhewpeblc6vcuxxcdiyn4yp6e5ngon53r4tq24litueyp4amu/';
const mappping = {
  Fennec_Fox: 'FennecFox.png',
  Shiba_Knight: 'Shiba.png',
  Rabbit_Healer: 'Rabbit.png',
  Sloth_Paladin: 'Sloth.png',
  Cat_Fencer: 'Cat.png',
  Cheetah_Wizard: 'Cheetar.png',
  Hamster_Fencer: 'Hamster.png',
  Red_Panda_Healer: 'Redpanda.png',
  Penguin_Ranger: 'Penguin.png',
  Panda_Wizard: 'Panda.png',
  Tiger_Paladin: 'Tiger.png',
  Pig_Knight: 'Pig.png',
  Slime: 'Slime.png',
  Slime_2: 'Slime2.png',
  Worm_2: 'Worm2.png',
  Worm: 'Worm.png',
  Pill_Bug: 'PillBug.png',
  Pill_Bug_2: 'PillBug2.png',
  Bee: 'Bee.png',
  Bee_2: 'Bee2.png',
  Crocodile: 'Crocodile.png',
  Frog: 'Frog.png',
  Shark: 'Shark.png',
};
interface Stats {
  attack: number;
  attackRange: number;
  attackSpeed: number;
  cooldownReduction: number;
  critChance: number;
  critMultipleDamage: number;
  defense: number;
  hasRage: boolean;
  healingAmplification: number;
  hpRegen: number;
  lifeSteal: number;
  maxHp: number;
  moveSpeed: number;
  physicalDamage: number;
  ragePerHit: number;
  returnAtkPercent: number;
  returnDamage: number;
  spellDamage: number;
  spellDefense: number;
}

interface StatsDisplayProps {
  stats: Stats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  if (stats && Object.keys(stats).length === 0) return null;
  return (
    <div className="stats-container">
      {stats &&
        Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-item">
            <div className="stat-key">{key}</div>
            <div className="stat-value">{String(value)}</div>
          </div>
        ))}
    </div>
  );
};

export const ViewAssetsFromGame = () => {
  const [itemType, setItemType] = React.useState<string | null>(null);
  const [assets, setAssets] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  console.log('assets', assets);
  const accessToken =
    // userSession?.user?.access_token ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVSURfNjg4MDhkNjhlODQwM2ZkNzYwYzkzNGEwIiwiZW1haWwiOiJzYW5nZGVwdHJhaUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwic2Vzc2lvbklkIjpbImI4MmM1Y2JmLTJhY2YtNDZmYi1hNDAwLThkMmNhMWUzYjFjNyIsImI4MmM1Y2JmLTJhY2YtNDZmYi1hNDAwLThkMmNhMWUzYjFjNyJdLCJqdGkiOiJkNzg3YWE2Yy01ODM3LTQ5N2YtOTNlZS0zYWJlZGU0ODg3MGEiLCJleHAiOjE3NTMyOTQxMjUsImlzcyI6IkFuaW1hbEdvQmFja0VuZCIsImF1ZCI6IkFuaW1hbEdvQ2xpZW50In0.gnk8vaenZ4NSopbf7r0pPVHvVcOKB4QIZeNrFPXobow';
  const fetchAssets = async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (!accessToken) {
        throw new Error('No authentication token available');
      }
      const response = await fetch(`${GameServerUrl}${itemType}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAssets();
  }, [itemType]);

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <h3>View Assets from Game</h3>
        </div>

        <div className="row asset-row">
          <label>
            Inventory
            <select
              value={itemType || ''}
              className="w-full builder-input"
              onChange={e => {
                setItemType(e.target.value);
              }}
            >
              <option value="">Select Item Type</option>
              <option value="user-character">Character</option>
              <option value="user-item">Items</option>
            </select>
          </label>
        </div>
        {itemType === 'user-character' ? (
          <div className="row asset-row asset-selector-card">
            {assets?.length > 0 &&
              assets
                .sort((a, b) =>
                  parseInt(a.characterName) < parseInt(b.characterName) ? -1 : 1
                )
                .map(asset => (
                  <div key={asset.id} className="asset-card">
                    <div className="asset-card-inner">
                      {asset?.characterConfigId && (
                        <div className="asset-image flex-col ">
                          <img
                            src={
                              asset?.characterConfigId &&
                              mappping.hasOwnProperty(asset.characterConfigId)
                                ? `${baseImgUrl}${
                                    mappping[
                                      asset.characterConfigId as keyof typeof mappping
                                    ]
                                  }`
                                : ''
                            }
                            alt="asset"
                          />
                        </div>
                      )}
                      <div className="asset-name flex-col">
                        <div className="title">characterConfigId:</div>
                        <div className="value">{asset.characterConfigId}</div>
                      </div>
                      <div className="asset-name flex-col">
                        <div className="title">Asset Type:</div>
                        <div className="value">{asset.characterName}</div>
                      </div>
                      <div className="asset-collection-id flex-col">
                        <div className="title">Shard count:</div>
                        <div className="value">{asset.shardCount}</div>
                      </div>
                      <div className="asset-token-id flex-col">
                        <div className="title">Stats</div>
                        <StatsDisplay stats={asset.stats} />
                      </div>
                      <div className="button-row">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="btn green"
                        >
                          Mint to NFT
                        </a>
                      </div>
                    </div>
                    <hr style={{ borderWidth: '1px' }} />
                  </div>
                ))}
          </div>
        ) : (
          <div className="row asset-row asset-selector-card">
            {assets
              .sort((a, b) =>
                parseInt(a.itemType) < parseInt(b.itemType) ? -1 : 1
              )
              .map(asset => (
                <div key={asset.id} className="asset-card">
                  <div className="asset-card-inner">
                    {
                      <div className="asset-image flex-col ">
                        <img
                          src={`${baseItemImgUrl}${asset?.icon}`}
                          alt="asset"
                        />
                      </div>
                    }
                    <div className="asset-name flex-col">
                      <div className="title">configId:</div>
                      <div className="value">{asset.configId}</div>
                    </div>
                    <div className="asset-name flex-col">
                      <div className="title">Asset Type:</div>
                      <div className="value">{asset.itemType}</div>
                    </div>
                    <div className="asset-collection-id flex-col">
                      <div className="title">Item Rarity:</div>
                      <div className="value">{asset.itemRarity}</div>
                    </div>
                    <div className="asset-token-id flex-col">
                      <div className="title">Main Stats</div>
                      <StatsDisplay stats={asset.mainStats} />
                      <Divider />
                      <div className="title">Sub Stats</div>
                      <StatsDisplay stats={asset.subStats} />
                    </div>
                    <div className="button-row">
                      <a target="_blank" rel="noreferrer" className="btn green">
                        Mint to NFT
                      </a>
                    </div>
                  </div>
                  <hr style={{ borderWidth: '1px' }} />
                </div>
              ))}
          </div>
        )}
        <div className="row">
          {isLoading && <span>Loading More Assets...</span>}
          {error && <div>Error loading assets</div>}
        </div>
      </div>
    </div>
  );
};
