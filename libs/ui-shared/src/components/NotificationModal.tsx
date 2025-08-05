import React from 'react';
import { Dialog } from './Dialog/Dialog';

interface ConfirmModalProps {
  showNotification: boolean;
  setShowNotification: (showNotification: boolean) => void;
}
export default function NotificationModal({
  showNotification,
  setShowNotification,
}: ConfirmModalProps) {
  return (
    showNotification && (
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
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%',
                        textShadow:
                          '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      }}
                    >
                      🎉 Notification 🎉
                    </span>
                  </h2>
                  <div
                    style={{
                      color: '#000',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    Congratulations! You have successfully minted a new NFT.
                    Please reload and check your Wallet. If you wish to burn the
                    NFT, please wait until the data is fully loaded
                  </div>
                  <div className="grid cols-1">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                      }}
                    >
                      <div
                        onClick={() => {
                          setShowNotification(false);
                        }}
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
