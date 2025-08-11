import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  DropDownMenu,
  getBalance,
  MenuProps,
  Navigation,
  shortAddress,
  useTransactQuery,
  CopyButton,
} from '@fv-sdk-demos/ui-shared';
import { useAuth, useConnector } from '@futureverse/auth-react';
import { useTrnApi } from '@futureverse/transact-react';
import { useQuery } from '@tanstack/react-query';
import { clearAllLocalStorage } from '../utils/localStorage';

const options = {
  localeMatcher: 'best fit',
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
} as const;
const formatter = new Intl.NumberFormat('en-US', options);

export default function Nav({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Navigation Menu={Menu} isMobileOpen={isOpen} setIsMobileOpen={setIsOpen} />
  );
}

export const Menu: React.FC<MenuProps> = () => {
  const { signOut, userSession } = useAuth();
  const { disconnect, isConnected } = useConnector();
  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>('fpass');
  const accountToCheck = useMemo(() => {
    if (!userSession) {
      return '';
    }
    return fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass;
  }, [fromWallet, userSession]);
  const { trnApi } = useTrnApi();
  const transactionQuery = useTransactQuery();
  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', fromWallet, accountToCheck, 2],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });

  // Custom checkbox styles
  const checkboxStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '0px 16px',
      gap: '8px',
    },
    toggleContainer: {
      position: 'relative' as const,
      width: '50px',
      height: '24px',
      backgroundColor: fromWallet === 'eoa' ? 'black' : '#9E9E9E',
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
      color: 'black',
      fontSize: '14px',
      fontWeight: '500',
      userSelect: 'none' as const,
    },
  };

  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', fromWallet, accountToCheck, 1],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });

  return (
    <>
      <DropDownMenu
        title={shortAddress(userSession?.futurepass ?? '', 6, 4)}
        buttonClasses="green"
        classes="wallet-dropdown"
      >
        <ul className="dropdown-content">
          <li>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img src="/images/black-market/XRP.png" />
                <p
                  style={{
                    fontWeight: '700',
                    marginLeft: '10px',
                  }}
                >
                  XRP
                </p>
              </div>
              <p
                style={{
                  fontWeight: '700',
                  marginRight: '10px',
                }}
              >
                {formatter.format(Number(xrpBalanceOnTrn.data?.balance ?? 0)) ??
                  'loading'}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img src="/images/black-market/ROOT.png" />
                <p
                  style={{
                    fontWeight: '700',
                    marginLeft: '10px',
                  }}
                >
                  ROOT
                </p>
              </div>
              <p
                style={{
                  fontWeight: '700',
                  marginRight: '10px',
                }}
              >
                {formatter.format(
                  Number(rootBalanceOnTrn.data?.balance ?? 0)
                ) ?? 'loading'}
              </p>
            </div>
          </li>
          <li>
            {/* Custom EOA/FuturePass Toggle */}
            <div style={checkboxStyles.container}>
              <span style={checkboxStyles.label}>Pass</span>
              <div
                style={checkboxStyles.toggleContainer}
                onClick={() => {
                  const newWallet = fromWallet === 'eoa' ? 'fpass' : 'eoa';
                  setFromWallet(newWallet);
                }}
              >
                <div style={checkboxStyles.toggleSlider} />
              </div>
              <span style={checkboxStyles.label}>EOA</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 16px',
              }}
            >
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                {shortAddress(
                  fromWallet === 'eoa'
                    ? userSession?.eoa ?? ''
                    : userSession?.futurepass ?? '',
                  6,
                  4
                ) || 'loading'}
              </span>
              <div>
                <CopyButton
                  contentToCopy={
                    fromWallet === 'eoa'
                      ? userSession?.eoa ?? ''
                      : userSession?.futurepass ?? ''
                  }
                />
              </div>
            </div>
          </li>
          <li className="wallet-dropdown-inner">
            <div
              onClick={() => {
                // Clear all localStorage data
                clearAllLocalStorage();
                // Disconnect and sign out
                isConnected && disconnect();
                signOut({ flow: 'redirect' });
              }}
            >
              <img src="/images/black-market/Logout.png" />
            </div>
          </li>
        </ul>
      </DropDownMenu>
    </>
  );
};

export const MobileMenu: React.FC<MenuProps> = ({ setIsOpen }) => {
  const { signOut, userSession } = useAuth();
  const { disconnect, isConnected } = useConnector();

  const [fromWallet, setFromWallet] = useState<'eoa' | 'fpass'>('fpass');
  const accountToCheck = useMemo(() => {
    if (!userSession) {
      return '';
    }
    return fromWallet === 'eoa' ? userSession?.eoa : userSession?.futurepass;
  }, [fromWallet, userSession]);
  const { trnApi } = useTrnApi();
  const transactionQuery = useTransactQuery();
  const xrpBalanceOnTrn = useQuery({
    queryKey: ['balance', fromWallet, accountToCheck, 2],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 2),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });

  // Custom checkbox styles
  const checkboxStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    toggleContainer: {
      position: 'relative' as const,
      width: '50px',
      height: '24px',
      backgroundColor: fromWallet === 'eoa' ? 'black' : '#9E9E9E',
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
      color: 'black',
      fontSize: '14px',
      fontWeight: '500',
      userSelect: 'none' as const,
    },
  };
  const rootBalanceOnTrn = useQuery({
    queryKey: ['balance', fromWallet, accountToCheck, 1],
    queryFn: async () =>
      getBalance(transactionQuery, accountToCheck as string, 1),
    enabled:
      !!trnApi &&
      !!userSession &&
      !!accountToCheck &&
      accountToCheck !== '' &&
      !!transactionQuery,
  });
  return (
    <div className="mobile-container-outer">
      <div
        className="close"
        onClick={() => setIsOpen && setIsOpen(false)}
        style={{
          backgroundColor: '#8ACA33',
          borderRadius: '16px',
        }}
      >
        Close
      </div>
      <ul
        className="mobile-container"
        style={{
          backgroundColor: '#ECE5CB',
          height: '50%',
          overflow: 'auto',
          borderRadius: '16px',
        }}
      >
        <li
          style={{
            width: '100%',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            padding: '16px',
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
              }}
            >
              <div style={checkboxStyles.toggleSlider} />
            </div>
            <span style={checkboxStyles.label}>EOA</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '16px',
            }}
          >
            <p
              style={{
                fontWeight: '700',
                marginRight: '10px',
                flex: 1,
              }}
            >
              {shortAddress(
                fromWallet === 'eoa'
                  ? userSession?.eoa ?? ''
                  : userSession?.futurepass ?? '',
                6,
                4
              ) || 'loading'}
            </p>
            <CopyButton
              contentToCopy={
                (fromWallet === 'eoa'
                  ? userSession?.eoa
                  : userSession?.futurepass) ?? ''
              }
            />
          </div>
        </li>

        <li
          style={{
            width: '100%',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src="/images/black-market/XRP.png" />
              <p
                style={{
                  fontWeight: '700',
                  marginLeft: '10px',
                }}
              >
                XRP
              </p>
            </div>
            <p
              style={{
                fontWeight: '700',
                marginRight: '10px',
              }}
            >
              {formatter.format(Number(xrpBalanceOnTrn.data?.balance ?? 0)) ??
                'loading'}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src="/images/black-market/ROOT.png" />
              <p
                style={{
                  fontWeight: '700',
                  marginLeft: '10px',
                }}
              >
                ROOT
              </p>
            </div>
            <p
              style={{
                fontWeight: '700',
                marginRight: '10px',
              }}
            >
              {formatter.format(Number(rootBalanceOnTrn.data?.balance ?? 0)) ??
                'loading'}
            </p>
          </div>
        </li>

        <li>
          <div
            className="wallet-dropdown-inner"
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '16px',
            }}
          >
            <button
              onClick={() => {
                // Clear all localStorage data
                clearAllLocalStorage();
                // Disconnect and sign out
                isConnected && disconnect();
                signOut({ flow: 'redirect' });
              }}
              className="green"
              style={{
                backgroundColor: '#ECE1CC',
                borderRadius: '16px',
                color: 'black',
                border: '1px solid black',
              }}
            >
              Log Out
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};
