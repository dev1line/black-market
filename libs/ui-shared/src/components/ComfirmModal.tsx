import React, { useMemo, useState } from 'react';
import { ExtrinsicResult } from '@futureverse/transact';

import { useCallback } from 'react';
import { useRootStore } from '../hooks/useRootStore';
import { formatUnits } from 'viem';
import { Dialog } from './Dialog/Dialog';
import CodeView from './CodeView';
import { TransactionPayload } from '@futureverse/transact-react';
import { useQueryClient } from '@tanstack/react-query';

interface ConfirmModalProps {
  showDialog: boolean;
  setShowDialog: (showDialog: boolean) => void;
  callback: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  tokenId: number;
  setTokenId: (tokenId: number) => void;
}
export default function ConfirmModal({
  showDialog,
  setShowDialog,
  callback,
  quantity,
  setQuantity,
  tokenId,
  setTokenId,
}: ConfirmModalProps) {
  const {
    gas,
    payload,
    toSign,
    setSigned,
    setSent,
    result,
    currentBuilder,
    setResult,
    signed,
    sent,
    setError,
    error,
    signedCallback,
    resultCallback,
  } = useRootStore(state => state);

  const showClose = useMemo(() => {
    if ((signed || sent) && !result && !error) {
      return false;
    }
    return true;
  }, [signed, sent, result, error]);

  return (
    // gas &&
    showDialog && (
      <Dialog>
        <Dialog.Container>
          <Dialog.Content>
            <div className="card">
              <div className="inner">
                {showClose && (
                  <button
                    className="dialog-close green"
                    onClick={() => setShowDialog(false)}
                  >
                    X
                  </button>
                )}

                <>
                  <h2>Mint to NFT</h2>

                  <div className="grid cols-1">
                    <div className="grid cols-2">
                      <label>
                        Token ID
                        <input
                          type="number"
                          value={tokenId}
                          //   disabled={true}
                          min={1}
                          max={1000}
                          className="w-full builder-input"
                          style={{ marginTop: '4px' }}
                          //   onChange={e => {
                          //     if (parseInt(e.target.value) <= 1000) {
                          //       setTokenId(Number(e.target.value));
                          //     }
                          //   }}
                        />
                      </label>
                      <label>
                        Quantity
                        <input
                          type="number"
                          value={quantity}
                          min={1}
                          max={1000}
                          className="w-full builder-input"
                          style={{ marginTop: '4px' }}
                          onChange={e => {
                            if (parseInt(e.target.value) <= 1000) {
                              setQuantity(Number(e.target.value));
                            }
                          }}
                        />
                      </label>
                    </div>

                    <button
                      className="builder-input green"
                      onClick={() => {
                        setShowDialog(false);
                        callback();
                      }}
                    >
                      OK
                    </button>
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
