import { useAuth } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import React, { Dispatch, SetStateAction } from 'react';

export interface MenuProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileOpen?: boolean;
  openByDefault?: boolean;
}

export function Navigation({
  Menu,
  isMobileOpen,
  setIsMobileOpen,
}: {
  Menu: React.FC<MenuProps>;
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { userSession } = useAuth();

  return (
    <div role="navigation">
      <ul className="desktop-nav ">
        {!userSession && <LogIn />}
        {userSession && (
          <Menu setIsOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />
        )}
      </ul>
      <ul className="mobile-nav">
        {!userSession && <LogIn />}
        {userSession && (
          <li className="mobile-wrap">
            <div
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="btn green"
              style={{
                backgroundColor: '#8ACA33',
                width: '120px',
                height: '50px',
                backgroundImage: "url('/images/black-market/ButtonMenu.png')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <span
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textShadow:
                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                }}
              >
                Menu
              </span>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export const LogIn = () => {
  const { openLogin } = useAuthUi();

  return (
    <div onClick={() => openLogin()}>
      <img
        src="/images/black-market/Button.png"
        alt="Welcome"
        style={{
          maxWidth: '200px',
          height: 'auto',
          maxHeight: '50px',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};
