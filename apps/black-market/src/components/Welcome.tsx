import { useAuth } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TokenDecryption } from '../crypto/decryption';
import { useEffect } from 'react';

const privateKeyPem = import.meta.env.VITE_PRIVATE_KEY || '';
const formattedPrivateKey = privateKeyPem
  ? privateKeyPem.replace(/\\n/g, '\n')
  : '';
const Welcome = () => {
  const { openLogin } = useAuthUi();
  const { userSession } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const encryptedAesKey = searchParams.get('encryptedAesKey');
  const iv = searchParams.get('iv');
  const encryptedData = searchParams.get('encryptedData');

  // Only create decoder if private key is available
  const decoder = formattedPrivateKey
    ? new TokenDecryption(formattedPrivateKey)
    : null;

  useEffect(() => {
    const calcAccessToken = async () => {
      if (!decoder || !encryptedAesKey || !iv || !encryptedData) {
        return;
      }

      try {
        const { accessToken, refreshToken } =
          await decoder.decryptTokenResponse({
            encryptedAesKey: encryptedAesKey,
            iv: iv,
            encryptedData: encryptedData,
          });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } catch (error) {
        console.error('Failed to decrypt token response:', error);
      }
    };
    calcAccessToken();
  }, [decoder, encryptedAesKey, iv, encryptedData]);

  return (
    <>
      <div
        id="welcome"
        className="welcome-responsive"
        style={{
          backgroundImage: "url('/images/black-market/Background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="card welcome-card">
          <img
            src="/images/black-market/AnimalGoIcon.png"
            alt="Welcome"
            className="welcome-main-img"
          />
          {!userSession ? (
            <div onClick={() => openLogin()} className="welcome-btn-wrap">
              <img
                src="/images/black-market/Button.png"
                alt="Welcome"
                className="welcome-btn-img"
              />
            </div>
          ) : (
            <div
              onClick={() => navigate('/black-market')}
              className="welcome-btn-wrap"
            >
              <div
                className="btn green"
                style={{
                  backgroundColor: '#8ACA33',
                  width: '120px',
                  height: '58px',
                  borderRadius: '16px',
                  backgroundImage: "url('/images/black-market/ButtonMenu.png')",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textShadow:
                      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                  }}
                >
                  Trade
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="footer welcome-footer">
          <img
            src="/images/black-market/Footer.png"
            alt="Footer"
            style={{ width: '100%' }}
          />
          <img
            src="/images/black-market/IMG.png"
            className="welcome-footer-img"
            alt="Welcome"
          />
        </div>
      </div>
    </>
  );
};

export default Welcome;
