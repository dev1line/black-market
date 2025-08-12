import {
  useAssets,
  useCollections,
} from '@futureverse/asset-register-react/v2';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import React, { useCallback, useState, useEffect } from 'react';
import ConfirmModal from '../ComfirmModal';
import { useTrnApi } from '@futureverse/transact-react';
import { ExtrinsicResult, TransactionBuilder } from '@futureverse/transact';
import { useGetExtrinsic, useGetSftUserTokens } from '../../hooks';
import { useRootStore } from '../../hooks/useRootStore';
import { TokenEncryption } from '../../crypto/encryption';
import { fetchWithTokenRefresh } from '../../helpers';

interface StatsDisplayProps {
  stats: {
    [key: string]: string | number;
  };
}

interface IProps {
  publicKey: string;
  gameServerUrl: string;
  assetControlled: string[];
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  if (stats && Object.keys(stats).length === 0) return null;
  return (
    <div className="stats-container">
      {stats &&
        Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-item">
            <div className="stat-key" title={key}>
              {key}
            </div>
            <div className="stat-value" title={String(value)}>
              {value}
            </div>
          </div>
        ))}
    </div>
  );
};

export const ViewAssets = ({
  publicKey,
  gameServerUrl,
  assetControlled,
}: IProps) => {
  const { userSession } = useAuth();
  const encoder = new TokenEncryption(publicKey ?? '');
  const { setCurrentBuilder, setResultCallback } = useRootStore(state => state);
  // Create an array of non-null wallet addresses
  const [walletsToUse, setWalletToUse] = useState<string[]>([]);
  const [feeAssetId, setFeeAssetId] = useState<number>(1);
  const { trnApi } = useTrnApi();
  const signer = useFutureverseSigner();

  const getExtrinsic = useGetExtrinsic();

  // const shouldShowEoa = useShouldShowEoa();

  // Initialize wallet based on userSession and shouldShowEoa
  useEffect(() => {
    if (userSession) {
      // const initialWallet = shouldShowEoa
      //   ? userSession.eoa
      //   : userSession.futurepass;
      setWalletToUse(userSession.futurepass ? [userSession.futurepass] : []);
    }
  }, [userSession]);

  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>();
  const [quantity, setQuantity] = useState(1);
  const [tokenId, setTokenId] = useState<number>(0);
  const [validMintedAssets, setValidMintedAssets] = useState<string[]>([]);

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>('fpass');
  const { data: collectionTokens } = useGetSftUserTokens(
    parseInt(collectionId?.split(':')[2] ?? '0'),
    walletsToUse[0] ?? '',
    assetControlled.length ?? 3
  );

  // Custom checkbox styles
  const checkboxStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
    },
    toggleContainer: {
      position: 'relative' as const,
      width: '50px',
      height: '24px',
      backgroundColor: fromWallet === 'eoa' ? '#30488D' : '#9E9E9E',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    toggleSlider: {
      position: 'absolute' as const,
      top: '2px',
      left: fromWallet === 'eoa' ? '26px' : '2px',
      width: '20px',
      height: '20px',
      backgroundColor: '#FFFFFF',
      borderRadius: '50%',
      transition: 'left 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    label: {
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: '500',
      userSelect: 'none' as const,
    },
  };

  const collectionQueryParams = React.useMemo(
    () => ({
      first: 100,
      addresses: walletsToUse,
    }),
    [walletsToUse]
  );

  const assetQueryParams = React.useMemo(
    () => ({
      first: 20,
      addresses: walletsToUse,
      collectionIds: [collectionId],
    }),
    [walletsToUse, collectionId]
  );

  const { collections } = useCollections(collectionQueryParams, {
    enabled: !!userSession,
    refetchOnWindowFocus: false,
  } as any);

  const {
    assets,
    reactQuery: { hasNextPage, fetchNextPage, isFetching, error, refetch },
  } = useAssets(assetQueryParams, {
    enabled: !!collectionId && !!userSession,
    refetchOnWindowFocus: false,
  } as any);

  const createBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    // Extract collection location from collectionId
    const collectionLocation = collectionId
      ? parseInt(collectionId.split(':')[2])
      : null;

    if (!collectionLocation || collectionLocation <= 0) {
      console.error('Invalid collection location:', collectionLocation);
      return;
    }

    if (!selectedItem) {
      console.error('No item selected for burning');
      return;
    }

    const nft =
      selectedItem?.assetType === 'ERC1155'
        ? await TransactionBuilder.sft(
            trnApi,
            signer,
            userSession.eoa,
            collectionLocation
          ).burn({
            serialNumbers: [
              {
                tokenId: Number(selectedItem?.tokenId) ?? 0,
                quantity: quantity,
              },
            ],
          })
        : await TransactionBuilder.nft(
            trnApi,
            signer,
            userSession.eoa,
            collectionLocation
          ).burn({
            serialNumber: Number(selectedItem?.tokenId) ?? 0,
          });
    if (fromWallet === 'fpass') {
      if (feeAssetId === 2) {
        await nft.addFuturePass(userSession.futurepass);
      }

      if (feeAssetId !== 2) {
        await nft.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    if (fromWallet === 'eoa') {
      if (feeAssetId !== 2) {
        await nft.addFeeProxy({
          assetId: feeAssetId,
          slippage: 5,
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const callBackHandler = async (result: ExtrinsicResult) => {
      if (result.result.isError) {
        console.log('result.result.isError', result.result.isError);
        return;
      }
      const mintId = selectedItem?.metadata?.attributes?.mintId;
      const entityType = selectedItem?.metadata?.attributes?.entityType;

      const burnData = {
        mintId:
          selectedItem.assetType === 'ERC1155'
            ? selectedItem?.metadata?.attributes?.configId
            : mintId,
        walletAddress: walletsToUse[0],
        entityType,
        amount: selectedItem.assetType === 'ERC1155' ? quantity : 1,
      };

      const encryptionResponse = await encoder.encryptTokenResponse(burnData);

      // call api POST to server localhost: 8080/api/animal-go/nft/mintSft
      await fetchWithTokenRefresh(
        `${gameServerUrl}/api/animal-go/crypto/burn`,
        {
          method: 'POST',
          body: JSON.stringify({
            encryptedAesKey: encryptionResponse.EncryptedAesKey,
            iv: encryptionResponse.IV,
            encryptedData: encryptionResponse.EncryptedData,
          }),
        },
        refreshAccessToken
      );

      //THEM POP UP NOTIFICATION
      setShowDialog(false);

      // Trigger refetch for ViewAssetsFromGame after successful burn
      // We'll use a custom event to communicate between components

      window.dispatchEvent(new CustomEvent('viewAssetsBurnSuccess'));
    };

    setResultCallback && setResultCallback(callBackHandler);

    getExtrinsic(nft);
    setCurrentBuilder(nft);
  }, [
    trnApi,
    signer,
    userSession,
    collectionId,
    selectedItem,
    tokenId,
    quantity,
    fromWallet,
    getExtrinsic,
    setCurrentBuilder,
    feeAssetId,
  ]);

  const handleBurn = () => {
    createBuilder();
    setShowDialog(true);
    refetch();
    fetchValidMintedAssets();
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(
        `${gameServerUrl}/api/animal-go/auth/refresh-token`,
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

      if (data?.data?.accessToken) {
        localStorage.setItem('accessToken', data?.data?.accessToken);
        localStorage.setItem('refreshToken', data?.data?.refreshToken);
        return {
          accessToken: data?.data?.accessToken ?? '',
          refreshToken: data?.data?.refreshToken ?? '',
        };
      }
      throw new Error('No accessToken in response');
    } catch (err) {
      throw err;
    }
  };

  const fetchValidMintedAssets = async () => {
    try {
      const response = await fetchWithTokenRefresh(
        `${gameServerUrl}/api/animal-go/crypto/entity-minted`,
        {},
        refreshAccessToken
      );

      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();

      setValidMintedAssets(data.data.map((item: any) => item?.id));
    } catch (err) {
      // setFetchDataError(
      //   err instanceof Error ? err.message : 'Failed to fetch assets'
      // );
    } finally {
    }
  };

  useEffect(() => {
    fetchValidMintedAssets();
  }, [collectionId]);

  // Listen for mint success event from ViewAssetsFromGame
  useEffect(() => {
    const handleMintSuccess = () => {
      refetch();
      fetchValidMintedAssets();
    };

    window.addEventListener('viewAssetsFromGameMintSuccess', handleMintSuccess);

    return () => {
      window.removeEventListener(
        'viewAssetsFromGameMintSuccess',
        handleMintSuccess
      );
    };
  }, [refetch]);

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
          {/* Custom EOA/FuturePass Toggle */}
          <div style={checkboxStyles.container}>
            <span style={checkboxStyles.label}>Pass</span>
            <div
              style={checkboxStyles.toggleContainer}
              onClick={() => {
                const newWallet = fromWallet === 'eoa' ? 'fpass' : 'eoa';
                setFromWallet(newWallet);
                const walletAddress =
                  newWallet === 'eoa'
                    ? userSession?.eoa
                    : userSession?.futurepass;
                setWalletToUse(walletAddress ? [walletAddress] : []);
              }}
            >
              <div style={checkboxStyles.toggleSlider} />
            </div>
            <span style={checkboxStyles.label}>EOA</span>
          </div>
          <div className="row">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
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
                  In Wallet
                </span>
              </p>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                {collectionId && (
                  <button
                    onClick={() => {
                      refetch();
                      fetchValidMintedAssets();
                    }}
                    disabled={isFetching}
                    style={{
                      backgroundColor: '#FFC444',
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: isFetching ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: isFetching ? 0.6 : 1,
                    }}
                    title="Refresh assets data"
                  >
                    {isFetching ? (
                      '...'
                    ) : (
                      <img
                        src="/images/black-market/reload.svg"
                        style={{ width: '20px', height: '20px' }}
                      />
                    )}
                  </button>
                )}
                <label>
                  <select
                    value={collectionId || ''}
                    className="w-full builder-input"
                    style={{
                      backgroundColor: '#30488D',
                      color: '#FFFFFF',
                      padding: '0px 8px',
                      borderRadius: '16px',
                      maxWidth: '150px',
                    }}
                    onChange={e => {
                      setCollectionId(e.target.value);
                    }}
                  >
                    <option value="">Select Collection</option>
                    {collections?.length > 0 &&
                      collections
                        .filter(collection =>
                          assetControlled.includes(
                            collection.location.toString()
                          )
                        )
                        .map((collection, i) => (
                          <option
                            key={`${collection.chainId}:${collection.name}:${i}`}
                            value={`${collection.chainId}:${collection.chainType}:${collection.location}`}
                          >
                            {collection.name}
                          </option>
                        ))}
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
              {assets?.length == 0 ? (
                <img
                  src="/images/black-market/EmptyWithText.png"
                  style={{
                    minWidth: '100px',
                  }}
                />
              ) : (
                <div className="row asset-row asset-selector-card">
                  {assets
                    .filter(
                      asset =>
                        validMintedAssets.includes(
                          asset?.metadata?.attributes?.mintId
                        ) || asset?.assetType === 'ERC1155'
                    )
                    .filter(asset => {
                      const record = collectionTokens?.find(
                        token =>
                          token.id.toString() === asset.tokenId.toString()
                      );

                      return (
                        record?.freeBalance !== '0' &&
                        record?.freeBalance !== null
                      );
                    })
                    .sort((a, b) =>
                      parseInt(a.tokenId) < parseInt(b.tokenId) ? -1 : 1
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
                          <div
                            className="asset-image flex-col"
                            style={{
                              width: '100%',
                              height: '200px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundImage:
                                "url('/images/black-market/BG.png')",
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <img
                              src={
                                asset?.metadata?.properties?.image ||
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
                                {asset.assetType || '-'}
                              </div>
                            </div>
                            <div className="asset-token-id flex-col">
                              <div className="title">Token ID:</div>
                              <div className="value">
                                {asset.tokenId || '-'}
                              </div>
                            </div>
                          </div>
                          <div className="asset-collection-id flex-col">
                            <div className="title">Collection ID:</div>
                            <div className="value">
                              {asset.collectionId || '-'}
                            </div>
                          </div>
                          {asset.assetType === 'ERC1155' && (
                            <div className="asset-collection-id flex-col">
                              <div className="title">Quantity:</div>
                              <div className="value">
                                {asset.ownership?.balancesOf?.[0]?.balance ||
                                  '-'}
                              </div>
                            </div>
                          )}
                          <StatsDisplay
                            stats={asset?.metadata?.attributes || {}}
                          />

                          <div
                            className="button-row"
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              display: 'none',
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
                              onClick={() => {
                                setSelectedItem(asset);
                                setShowDialog(true);
                              }}
                            >
                              Burn Into Game
                            </a>
                          </div>
                        </div>

                        <hr style={{ borderWidth: '1px' }} />
                      </div>
                    ))}
                </div>
              )}
              {showDialog && (
                <ConfirmModal
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  setTokenId={setTokenId}
                  feeAssetId={feeAssetId}
                  setFeeAssetId={setFeeAssetId}
                  tokenId={tokenId}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  callback={handleBurn}
                  asset={selectedItem}
                  title="Burn into Game"
                  itemType={''}
                />
              )}
              <div className="row">
                {hasNextPage && (
                  <button onClick={() => fetchNextPage()} disabled={isFetching}>
                    Load More
                  </button>
                )}
                {isFetching && <span>Loading More Assets...</span>}
                {error && <div>Error loading assets</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
