import React from 'react';
import { Dialog } from './Dialog/Dialog';
import { useAuth } from '@futureverse/auth-react';
import { EItemStatTypes } from './ViewAssetComps/ViewAssetFromGame';

interface ConfirmModalProps {
  showDialog: boolean;
  setShowDialog: (showDialog: boolean) => void;
  callback: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  tokenId: number;
  setTokenId: (tokenId: number) => void;
  mintTo?: string;
  setMintTo?: (owner: string) => void;
  feeAssetId: number;
  setFeeAssetId: (feeAssetId: number) => void;
  asset: any;
  title: string;
  itemType: string;
}
export default function ConfirmModal({
  showDialog,
  setShowDialog,
  callback,
  quantity,
  setQuantity,
  setTokenId,
  asset,
  title,
  itemType,
  mintTo,
  setMintTo,
  feeAssetId,
  setFeeAssetId,
}: ConfirmModalProps) {
  const { userSession } = useAuth();
  return (
    showDialog && (
      <Dialog>
        <Dialog.Container>
          <Dialog.Content>
            <div
              className="card"
              style={{
                backgroundColor: '#ECE5CB',
                borderRadius: '16px',
              }}
            >
              <div
                className="inner"
                style={{
                  backgroundColor: '#ECE5CB',
                  borderRadius: '16px',
                }}
              >
                <>
                  <h2
                    style={{
                      textAlign: 'center',
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
                      {title}
                    </span>
                  </h2>

                  <div className="grid cols-1">
                    {itemType === 'equipment' ? (
                      <div className="grid md:cols-2 cols-1 ">
                        <label>
                          <p>
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
                              Mint To
                            </span>
                          </p>
                          <select
                            value={mintTo || ''}
                            className="w-full builder-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '14px',
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              backgroundColor: '#f9f9f9',
                              fontFamily: 'inherit',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            onChange={e => {
                              setMintTo && setMintTo(e.target.value);
                            }}
                          >
                            <option value={userSession?.eoa}>
                              {userSession?.eoa}
                            </option>
                            <option value={userSession?.futurepass}>
                              {userSession?.futurepass}
                            </option>
                          </select>
                        </label>
                        <label>
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
                            Item Type
                          </span>
                          <input
                            type="text"
                            value={asset?.configId}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Quantity
                          </span>
                          <input
                            type="number"
                            value={quantity}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Rare
                          </span>
                          <input
                            type="number"
                            value={asset?.itemRarity}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Main Stats
                          </span>
                          <div style={{ marginTop: '4px' }}>
                            {asset?.mainStats && asset.mainStats.length > 0 ? (
                              asset.mainStats.map((stat: any, idx: number) => (
                                <div
                                  key={stat.statType + idx}
                                  style={{ marginBottom: 8 }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      color: 'red',
                                    }}
                                  >
                                    <span>{EItemStatTypes[stat.statType]}</span>
                                    <span>
                                      {stat.statValue}
                                      {stat.statMax ? ` / ${stat.statMax}` : ''}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      background: '#e0e0e0',
                                      borderRadius: 8,
                                      height: 8,
                                      width: '100%',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: stat.statMax
                                          ? `${Math.min(
                                              100,
                                              Math.round(
                                                (stat.statValue /
                                                  stat.statMax) *
                                                  100
                                              )
                                            )}%`
                                          : '100%',
                                        background: '#8ACA33',
                                        height: '100%',
                                        borderRadius: 8,
                                        transition: 'width 0.3s',
                                      }}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span style={{ color: '#888' }}>
                                No main stats
                              </span>
                            )}
                          </div>
                        </label>
                        <label>
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
                            Sub Stats
                          </span>
                          <div style={{ marginTop: '4px' }}>
                            {asset?.subStats && asset.subStats.length > 0 ? (
                              asset.subStats.map((stat: any, idx: number) => (
                                <div
                                  key={stat.statType + idx}
                                  style={{ marginBottom: 8 }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      color: 'red',
                                    }}
                                  >
                                    <span>{EItemStatTypes[stat.statType]}</span>
                                    <span>
                                      {stat.statValue}
                                      {stat.statMax ? ` / ${stat.statMax}` : ''}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      background: '#e0e0e0',
                                      borderRadius: 8,
                                      height: 8,
                                      width: '100%',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: stat.statMax
                                          ? `${Math.min(
                                              100,
                                              Math.round(
                                                (stat.statValue /
                                                  stat.statMax) *
                                                  100
                                              )
                                            )}%`
                                          : '100%',
                                        background: '#8ACA33',
                                        height: '100%',
                                        borderRadius: 8,
                                        transition: 'width 0.3s',
                                      }}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span style={{ color: '#888' }}>
                                No sub stats
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ) : itemType === 'character' ? (
                      <div className="grid md:cols-2 cols-1 ">
                        <label>
                          <p>
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
                              Mint To
                            </span>
                          </p>
                          <select
                            value={mintTo || ''}
                            className="w-full builder-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '14px',
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              backgroundColor: '#f9f9f9',
                              fontFamily: 'inherit',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            onChange={e => {
                              setMintTo && setMintTo(e.target.value);
                            }}
                          >
                            <option value={userSession?.eoa}>
                              {userSession?.eoa}
                            </option>
                            <option value={userSession?.futurepass}>
                              {userSession?.futurepass}
                            </option>
                          </select>
                        </label>
                        <label>
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
                            Asset Type
                          </span>
                          <input
                            type="text"
                            value={asset?.characterConfigId}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Quantity
                          </span>
                          <input
                            type="number"
                            value={quantity}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Star
                          </span>
                          <input
                            type="number"
                            value={asset?.star}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                      </div>
                    ) : itemType === 'stone' ? (
                      <div className="grid md:cols-2 cols-1 ">
                        <label>
                          <p>
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
                              Mint To
                            </span>
                          </p>
                          <select
                            value={mintTo || ''}
                            className="w-full builder-input"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '14px',
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              backgroundColor: '#f9f9f9',
                              fontFamily: 'inherit',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            onChange={e => {
                              setMintTo && setMintTo(e.target.value);
                            }}
                          >
                            <option value={userSession?.eoa}>
                              {userSession?.eoa}
                            </option>
                            <option value={userSession?.futurepass}>
                              {userSession?.futurepass}
                            </option>
                          </select>
                        </label>
                        <label>
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
                            Asset Type
                          </span>
                          <input
                            type="text"
                            value={asset?.configId}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Quantity :{' '}
                            <span style={{ color: 'green' }}>
                              MAX {asset?.amount}
                            </span>
                          </span>
                          <input
                            type="number"
                            min={1}
                            max={asset?.amount}
                            value={quantity}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            onChange={e => {
                              if (parseInt(e.target.value) > asset?.amount) {
                                e.target.value = asset?.amount.toString();
                              }
                              setQuantity(parseInt(e.target.value));
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="grid md:cols-2 cols-1 ">
                        <label>
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
                            Asset Type
                          </span>
                          <input
                            type="text"
                            value={asset?.assetType}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        {asset.assetType === 'ERC1155' && (
                          <label>
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
                              Quantity{' '}
                              <span style={{ color: 'green' }}>
                                MAX {asset?.ownership?.balancesOf?.[0]?.balance}
                              </span>
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={asset?.ownership?.balancesOf?.[0]?.balance}
                              value={quantity}
                              className="w-full builder-input"
                              style={{ marginTop: '4px' }}
                              onChange={e => {
                                if (
                                  parseInt(e.target.value) >
                                  asset?.ownership?.balancesOf?.[0]?.balance
                                ) {
                                  e.target.value = asset?.amount.toString();
                                }
                                setQuantity(parseInt(e.target.value));
                              }}
                            />
                          </label>
                        )}
                        <label>
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
                            Token ID
                          </span>
                          <input
                            type="number"
                            value={asset?.tokenId}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>
                        <label>
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
                            Collection ID
                          </span>
                          <input
                            type="number"
                            value={asset?.rawData?.collection?.location}
                            className="w-full builder-input"
                            style={{ marginTop: '4px' }}
                            readOnly
                          />
                        </label>

                        <label>
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
                            Fee Asset ID
                          </span>
                          <div className="relative">
                            <select
                              value={feeAssetId}
                              className="w-full builder-input"
                              style={{
                                marginTop: '4px',
                                paddingLeft: '40px',
                                backgroundImage: `url(${
                                  feeAssetId === 1
                                    ? '/images/black-market/ROOT.png'
                                    : '/images/black-market/XRP.png'
                                })`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '8px center',
                                backgroundSize: '24px 24px',
                              }}
                              onChange={e => {
                                setFeeAssetId(parseInt(e.target.value));
                              }}
                            >
                              <option value={1}>ROOT</option>
                              <option value={2}>XRP</option>
                            </select>
                          </div>
                        </label>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                      }}
                    >
                      <div
                        onClick={() => {
                          setShowDialog(false);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src="/images/black-market/DisagreeButton.png" />
                      </div>
                      <div
                        onClick={() => {
                          setShowDialog(false);
                          setTokenId(asset?.tokenId);
                          callback();
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src="/images/black-market/AgreeButton.png" />
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Container>
      </Dialog>
    )
  );
}
