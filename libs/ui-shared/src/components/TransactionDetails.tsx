'use client';

import React, { useMemo } from 'react';
import { ExtrinsicResult } from '@futureverse/transact';

import { useCallback } from 'react';
import { useRootStore } from '../hooks/useRootStore';
import { formatUnits } from 'viem';
import { Dialog } from './Dialog/Dialog';
import { TransactionPayload } from '@futureverse/transact-react';
import { useQueryClient } from '@tanstack/react-query';

export default function TransactionDetails() {
  const queryClient = useQueryClient();

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
    resetState,
  } = useRootStore(state => state);

  // Calculate showDialog based on transaction state instead of local state
  const showDialog = useMemo(() => {
    // Show dialog if we have gas data and either no result/error, or we have a result/error to show
    return gas && ((!result && !error) || result || error);
  }, [gas, result, error]);

  const onSign = useCallback(() => {
    setSigned(true);
    signedCallback && signedCallback();
  }, [setSigned, signedCallback]);

  const onSend = useCallback(() => {
    setSent(true);
  }, [setSent]);

  const onResult = useCallback(
    (result: ExtrinsicResult) => {
      resultCallback && resultCallback(result);
      queryClient.clear();
    },
    [resultCallback, queryClient]
  );

  const signExtrinsic = useCallback(async () => {
    if (toSign && currentBuilder) {
      try {
        const result = await currentBuilder.signAndSend({ onSign, onSend });
        setResult(result as ExtrinsicResult);
        onResult && onResult(result);
      } catch (e: any) {
        console.error(e);
        if (typeof e === 'string') {
          setError(e);
        }
        if (typeof e === 'object') {
          setError(e?.message);
        }
      }
    }
  }, [currentBuilder, onResult, onSend, onSign, setError, setResult, toSign]);

  const showClose = useMemo(() => {
    if ((signed || sent) && !result && !error) {
      return false;
    }
    return true;
  }, [signed, sent, result, error]);

  const handleClose = useCallback(() => {
    resetState();
    window.dispatchEvent(new CustomEvent('viewAssetsBurnSuccess'));
    window.dispatchEvent(new CustomEvent('viewAssetsFromGameMintSuccess'));
  }, [resetState]);

  return (
    gas &&
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
                {showClose && (
                  <button className="dialog-close green" onClick={handleClose}>
                    X
                  </button>
                )}
                {!result && !error && !signed && (
                  <>
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
                      <h2>Transaction Details</h2>
                    </span>
                    <div className="grid cols-1  gap-0 mb-8">
                      <div className="w-full small">Gas Details</div>
                      <div className="gas-wrap">
                        <div>Gas Fee: {gas.gasFee}</div>
                        <div>Gas String: {gas.gasString}</div>
                        <div>Gas Token Decimals: {gas.tokenDecimals}</div>
                        <div>
                          Gas Token Decimals Formatted:{' '}
                          {formatUnits(BigInt(gas.gasFee), gas.tokenDecimals)}
                        </div>
                      </div>
                    </div>
                    {toSign && (
                      <div className="grid cols-1  gap-0">
                        <div className="w-full small">Message To Sign</div>
                        <span className="pre">{toSign}</span>
                      </div>
                    )}
                    {payload && (
                      <>
                        <TransactionPayload
                          payload={payload.trnPayload}
                          config={{
                            backgroundColor: 'var(--white)',
                            textColor: 'var(--cta)',
                            lineColor: 'var(--cta)',
                            highlightColor: 'var(--cta)',
                            highlightTextColor: 'var(--white)',
                            lowlightColor: 'var(--cta-hover)',
                            lowlightTextColor: 'var(--cta)',
                            addressHighlightColor: 'var(--cta)',
                          }}
                        />

                        {!signed && (
                          <button
                            className="builder-input green"
                            onClick={signExtrinsic}
                            style={{
                              backgroundColor: '#8ACA33',
                              borderRadius: '16px',
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
                              <h2> Sign & Send</h2>
                            </span>
                          </button>
                        )}
                      </>
                    )}
                    {signed && <div>Extrinsic Has Been Signed</div>}
                    {signed && !result && !error && <div className="spinner" />}

                    {sent && <div>Extrinsic Sent</div>}
                  </>
                )}
                {signed && !result && !error && (
                  <div className="grid cols-1">
                    <div
                      className="spinner"
                      style={{
                        margin: '0 auto',
                        marginTop: '16px',
                        width: '100px',
                        height: '100px',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
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
                        Waiting for transaction to finalise...
                      </span>
                    </div>
                  </div>
                )}
                {result && (
                  <>
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
                      <h2>Transaction Result</h2>
                    </span>

                    <div className="grid cols-1">
                      <pre>
                        {JSON.stringify(result.result.toHuman(), null, 2)}
                      </pre>

                      <a
                        href={`https://porcini.rootscan.io/extrinsic/${result.extrinsicId}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ textDecoration: 'underline' }}
                      >
                        <span
                          style={{
                            color: '#fff',
                            fontWeight: '500',
                            textAlign: 'center',
                            width: '100%',
                            textShadow:
                              '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                          }}
                        >
                          View Extrinsic on Explorer ({result.extrinsicId})
                        </span>
                      </a>
                      <button
                        className="builder-input green"
                        onClick={handleClose}
                        style={{
                          backgroundColor: '#8ACA33',
                          borderRadius: '16px',
                          cursor: 'pointer',
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
                          <h2>Close</h2>
                        </span>
                      </button>
                    </div>
                  </>
                )}
                {error && (
                  <div
                    className="error"
                    style={{
                      background: 'rgba(223, 19, 19, 0.445)',
                      padding: '8px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      className="error-title"
                      style={{
                        fontWeight: '700',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      There has been an error...
                    </div>
                    <div className="error-message" style={{ fontSize: '12px' }}>
                      {error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Container>
      </Dialog>
    )
  );
}
