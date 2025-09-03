import './App.css';
import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { Header, useIsMobile } from '@fv-sdk-demos/ui-shared';
import Login from './components/Login';
import Nav, { MobileMenu } from './components/Nav';
import useIsAuthed from './hooks/useIsAuthed';
import BlackMarket from './components/BlackMarket';
import Welcome from './components/Welcome';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        {/* <Route path="/transact/assets" element={<Assets />} />
        <Route path="/transact/nft" element={<Nft />} />
        <Route path="/transact/sft" element={<Sft />} /> */}
        {/* <Route
          index
          element={
            <Home title="Welcome to the Root Network SDK Playground (Vite)" />
          }
        /> */}
        {/* <Route path="/transact/assets" element={<Assets />} />
        <Route path="/transact/batch-all" element={<BatchAll />} />
        <Route path="/transact/custom" element={<Custom />} />
        <Route path="/transact/custom-builder" element={<CustomBuilder />} />
        <Route path="/transact/evm" element={<Evm />} />
        <Route path="/transact/nft" element={<Nft />} />
        <Route path="/transact/sft" element={<Sft />} />
        <Route path="/evm/erc-20" element={<EvmErc20 />} />
        <Route path="/evm/erc-721" element={<EvmErc721 />} />
        <Route path="/evm/erc-1155" element={<EvmErc1155 />} />
        <Route path="/evm/fee-proxy" element={<FeeProxy />} />
        <Route path="/evm/futurePass-proxy" element={<FuturePassProxy />} />

        <Route path="/asset-register/view" element={<ViewAssetsComp />} />
        <Route path="/asset-register/link" element={<AssetLink />} /> */}
        <Route path="/black-market" element={<BlackMarket />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile(992);

  useIsAuthed({ redirectUrl: '/' });

  return (
    <div className="body-wrap">
      <div>
        <Header
          Nav={() => <Nav setIsOpen={setIsOpen} isOpen={isOpen} />}
          Logo={() => (
            <div className="header__logo__row">
              <Link to="/">
                <img
                  src="/images/black-market/AnimalGoIcon.png"
                  alt="Welcome"
                  width={100}
                  style={{
                    maxWidth: '100px',
                    height: 'auto',
                  }}
                />
              </Link>
              <span className="pill">Porcini</span>
            </div>
          )}
        />
      </div>
      {isOpen && isMobile && <MobileMenu setIsOpen={setIsOpen} />}
      {/* <div className="inner"> */}
      <Outlet />
      {/* </div> */}
      {/* <Footer /> */}
      {/* <div className="footer" style={{ position: 'relative' }}>
        <img
          src="/images/black-market/Footer.png"
          alt="Footer"
          style={{ width: '100%' }}
        />
        <img
          src="/images/black-market/IMG.png"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
          alt="Welcome"
        />
      </div> */}
    </div>
  );
}
