import { useAuth } from '@futureverse/auth-react';
import { Divider } from '@futureverse/auth-ui';
import React, { useEffect, useState } from 'react';
import ConfirmModal from '../ComfirmModal';
import { TokenEncryption } from '../../crypto/encryption';
import Spinner from '../Spinner';
import NotificationModal from '../NotificationModal';

export const EItemStatTypes = [
  'Attack',
  'PhysicalDamage',
  'SpellDamage',
  'Defense',
  'SpellDefense',
  'CritChance',
  'CritMultipleDamage',
  'MaxHP',
  'HpRegen',
  'HealingAmplification',
  'ReturnDamage',
  'CooldownReduction',
  'AttackSpeed',
];
const baseImgUrl =
  'https://purple-accused-porpoise-873.mypinata.cloud/ipfs/bafybeihvgsenwooaofh6zyvu2oowf5vblokkd5tedhhcrl2rrugkq7gthq/';
const baseImgStoneUrl =
  'https://purple-accused-porpoise-873.mypinata.cloud/ipfs/bafybeifzif4ol3yqelo3ejeablp6wi5apjm6fau6yotlwwzeyazkimzbiu/';
const baseImgEquipmentUrl =
  'https://purple-accused-porpoise-873.mypinata.cloud/ipfs/bafybeie66uvmv7jhiaa2boucv2u25rq43jpkdqcaqhz5eznmesf4jjpjzy/';

interface StatsDisplayProps {
  isMain?: boolean;
  stats: {
    statType: number;
    statValue: number;
  }[];
}

interface IProps {
  publicKey: string;
  gameServerUrl: string;
  assetControlled: string[];
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  isMain = false,
}) => {
  return (
    <div
      className="stats-container"
      style={{
        minHeight: 32,
        backgroundColor: isMain ? '#307B8D' : 'transparent',
      }}
    >
      {stats && stats.length > 0 ? (
        stats.map(item => (
          <div key={item.statType} className="stat-item">
            <div className="stat-key">{EItemStatTypes[item?.statType]}</div>
            <div className="stat-value">{String(item.statValue)}</div>
          </div>
        ))
      ) : (
        <div className="stat-placeholder" style={{ minHeight: 24 }}></div>
      )}
    </div>
  );
};

export const ViewAssetsFromGame = ({ publicKey, gameServerUrl }: IProps) => {
  const { userSession } = useAuth();
  const encoder = new TokenEncryption(publicKey);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>();
  const [itemType, setItemType] = useState<string>('equipment');
  const [assets, setAssets] = useState<{
    character: any[];
    equipment: any[];
    stone: any[];
  }>({ character: [], equipment: [], stone: [] });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [mintTo, setMintTo] = useState<string>(userSession?.eoa ?? '');
  const [quantity, setQuantity] = useState(1);
  const [tokenId, setTokenId] = useState<number>(0);

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(
        'https://seahorse-magnetic-officially.ngrok.app/api/animal-go/auth/refresh-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        }
      );
      if (!response.ok) throw new Error('Failed to refresh token');
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.accessToken;
      }
      throw new Error('No accessToken in response');
    } catch (err) {
      throw err;
    }
  };

  const fetchAssets = async () => {
    // setFetchDataError(null);
    setIsLoading(true);
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (!accessToken) {
        throw new Error('No authentication token available');
      }
      let response = await fetch(
        `${gameServerUrl}/api/animal-go/crypto/equipment-character-mint`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Nếu accessToken hết hạn, thử refresh
      if (response.status === 400 && refreshToken) {
        try {
          accessToken = await refreshAccessToken(refreshToken);
          // Thử lại với accessToken mới
          response = await fetch(`${gameServerUrl}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (refreshErr) {
          throw new Error('Failed to refresh access token');
        }
      }
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data.data);
    } catch (err) {
      // setFetchDataError(
      //   err instanceof Error ? err.message : 'Failed to fetch assets'
      // );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [itemType]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedItem]);

  const createNFTBYAdmin = async () => {
    const dataSending = {
      id: selectedItem?.id,
      entityType:
        itemType === 'character' ? 0 : itemType === 'equipment' ? 1 : 2,
      amount: itemType === 'stone' ? quantity : 1,
      walletAddress: mintTo,
    };
    const encryptionResponse = await encoder.encryptTokenResponse(dataSending);

    const accessToken = localStorage.getItem('accessToken');
    // call api POST to server localhost: 8080/api/animal-go/nft/mintSft
    await fetch(`${gameServerUrl}/api/animal-go/crypto/admin-mint`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryptedAesKey: encryptionResponse.EncryptedAesKey,
        iv: encryptionResponse.IV,
        encryptedData: encryptionResponse.EncryptedData,
      }),
    });
  };

  const handleMint = async () => {
    setIsLoading(true);
    try {
      await createNFTBYAdmin();
      // view Notification Modal
      setShowNotification(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full inventory-card">
      <div className="card">
        <div
          className="inner"
          style={{
            backgroundColor: '#4A68BE',
            border: '8px solid #303A82',
          }}
        >
          <div className="row">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '44px 0px 12px',
              }}
            >
              <p
                style={{
                  padding: '12px 8px',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%',
                    textShadow:
                      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                  }}
                >
                  In Game
                </span>
              </p>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <button
                  onClick={() => {
                    fetchAssets();
                  }}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#FFC444',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  title="Refresh assets data"
                >
                  {isLoading ? (
                    '...'
                  ) : (
                    <img
                      src="/images/black-market/reload.svg"
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </button>
                <label>
                  <select
                    value={itemType || ''}
                    className="w-full builder-input"
                    style={{
                      backgroundColor: '#30488D',
                      color: '#FFFFFF',
                      padding: '0px 8px',
                      borderRadius: '16px',
                      maxWidth: '150px',
                    }}
                    onChange={e => {
                      setItemType(e.target.value);
                    }}
                  >
                    {/* <option value="">Select Item Type</option> */}
                    <option value="character">Character</option>
                    <option value="equipment">Equipment</option>
                    <option value="stone">Stone</option>
                  </select>
                </label>
              </div>
            </div>
            <div
              className="inner inner-select"
              style={{
                backgroundColor: '#30488D',
                height: '999px',
                overflowY: 'auto',
              }}
            >
              {(itemType === 'character' && assets?.character?.length === 0) ||
              (itemType === 'equipment' && assets?.equipment?.length === 0) ||
              (itemType === 'stone' && assets?.stone?.length === 0) ? (
                <img
                  src="/images/black-market/EmptyWithText.png"
                  style={{
                    minWidth: '100px',
                  }}
                />
              ) : itemType === 'character' ? (
                <div className="row asset-row asset-selector-card">
                  {assets?.character
                    .sort((a, b) =>
                      parseInt(a?.star) < parseInt(b?.star) ? -1 : 1
                    )
                    .map(asset => (
                      <div
                        key={asset.id}
                        className="asset-card group"
                        style={{ position: 'relative' }}
                      >
                        <div
                          className="asset-card-inner"
                          style={{
                            transition:
                              'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                          }}
                        >
                          <div className="asset-image flex-col">
                            <img
                              src={
                                `${baseImgUrl}${asset?.characterConfigId}.png` ||
                                '/images/black-market/BG.png'
                              }
                              alt="asset"
                              onError={e => {
                                if (
                                  !e.currentTarget.src.endsWith(
                                    '/images/black-market/BG.png'
                                  )
                                ) {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    '/images/black-market/BG.png';
                                }
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="asset-name flex-col">
                              <div className="title">Asset Type:</div>
                              <div className="value">
                                {asset.characterConfigId || '-'}
                              </div>
                            </div>
                            <div className="asset-token-id flex-col">
                              <div className="title">Star:</div>
                              <div className="value">{asset.star || '-'}</div>
                            </div>
                          </div>

                          <div
                            className="button-row always-show-mobile"
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onClick={() => {
                              setSelectedItem(asset);
                              setShowDialog(true);
                            }}
                          >
                            <a
                              className="btn green"
                              style={{
                                backgroundColor: '#FFC444',
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                              }}
                            >
                              Mint To NFT
                            </a>
                          </div>
                        </div>

                        <hr style={{ borderWidth: '1px' }} />
                      </div>
                    ))}
                </div>
              ) : itemType === 'stone' ? (
                <div className="row asset-row asset-selector-card">
                  {assets?.stone
                    .sort((a, b) =>
                      parseInt(a.type) < parseInt(b.type) ? -1 : 1
                    )
                    .map(asset => (
                      <div
                        key={asset.id}
                        className="asset-card group"
                        style={{ position: 'relative' }}
                      >
                        <div
                          className="asset-card-inner"
                          style={{
                            transition:
                              'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                          }}
                        >
                          <div className="asset-image flex-col">
                            <img
                              src={
                                `${baseImgStoneUrl}${asset?.configId}.png` ||
                                '/images/black-market/BG.png'
                              }
                              alt="asset"
                              onError={e => {
                                if (
                                  !e.currentTarget.src.endsWith(
                                    '/images/black-market/BG.png'
                                  )
                                ) {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    '/images/black-market/BG.png';
                                }
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="asset-name flex-col">
                              <div className="title">Asset Type:</div>
                              <div className="value">
                                {asset.configId || '-'}
                              </div>
                            </div>
                            <div className="asset-token-id flex-col">
                              <div className="title">Amount:</div>
                              <div className="value">{asset.amount || '-'}</div>
                            </div>
                          </div>

                          <div
                            className="button-row always-show-mobile"
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onClick={() => {
                              setSelectedItem(asset);
                              setShowDialog(true);
                            }}
                          >
                            <a
                              className="btn green"
                              style={{
                                backgroundColor: '#FFC444',
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                              }}
                            >
                              Mint To NFT
                            </a>
                          </div>
                        </div>

                        <hr style={{ borderWidth: '1px' }} />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="row asset-row asset-selector-card">
                  {assets?.equipment
                    .sort((a, b) =>
                      parseInt(a.itemRarity) < parseInt(b.itemRarity) ? -1 : 1
                    )
                    .map(asset => (
                      <div
                        key={asset.id}
                        className="asset-card group"
                        style={{ position: 'relative' }}
                      >
                        <div
                          className="asset-card-inner"
                          style={{
                            transition:
                              'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                          }}
                        >
                          <div className="asset-image flex-col">
                            <img
                              src={`${baseImgEquipmentUrl}${asset?.icon}`}
                              alt="asset"
                              onError={e => {
                                if (
                                  !e.currentTarget.src.endsWith(
                                    '/images/black-market/BG.png'
                                  )
                                ) {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    '/images/black-market/BG.png';
                                }
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="asset-name flex-col">
                              <div className="title">Asset Type:</div>
                              <div className="value">
                                {asset.configId || '-'}
                              </div>
                            </div>
                            <div className="asset-token-id flex-col">
                              <div className="title">Rare:</div>
                              <div className="value">
                                {asset.itemRarity || '-'}
                              </div>
                            </div>
                          </div>

                          <StatsDisplay stats={asset.mainStats} isMain={true} />
                          <Divider />
                          <StatsDisplay stats={asset.subStats} isMain={false} />

                          <div
                            className="button-row always-show-mobile"
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            onClick={() => {
                              setSelectedItem(asset);
                              setShowDialog(true);
                            }}
                          >
                            <a
                              className="btn green"
                              style={{
                                backgroundColor: '#FFC444',
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                              }}
                            >
                              Mint To NFT
                            </a>
                          </div>
                        </div>

                        <hr style={{ borderWidth: '1px' }} />
                      </div>
                    ))}
                </div>
              )}
              {isLoading && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <Spinner />
                    <span>Đang xử lý, vui lòng chờ...</span>
                  </div>
                </div>
              )}
              {showDialog && (
                <ConfirmModal
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  setTokenId={setTokenId}
                  tokenId={tokenId}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  callback={handleMint}
                  asset={selectedItem}
                  title="Mint to NFT"
                  mintTo={mintTo}
                  setMintTo={setMintTo}
                  itemType={itemType ?? ''}
                />
              )}
              {true && (
                <NotificationModal
                  showNotification={showNotification}
                  setShowNotification={setShowNotification}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
