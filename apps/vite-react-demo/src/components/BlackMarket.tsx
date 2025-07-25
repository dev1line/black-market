import { TransactionDetails, useIsMounted } from '@fv-sdk-demos/ui-shared';
import {
  ViewAssets,
  ViewAssetsFromGame,
} from '../../../../libs/ui-shared/src/components/ViewAssetComps';
import { useAuth } from '@futureverse/auth-react';
import { useRootStore } from '../../../../libs/ui-shared/src/hooks/useRootStore';
import { useEffect } from 'react';
import { decryptHybridData } from './utils';
import { fetchAndDecryptToken } from './decryption';

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [\w\s]+-----/, '')
    .replace(/-----END [\w\s]+-----/, '')
    .replace(/\s+/g, '');

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function pemToCryptoKey(privatePem: string): Promise<CryptoKey> {
  const binaryDer = pemToArrayBuffer(privatePem);
  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );
}

async function decryptLoginResponse(
  EncryptedAesKey: string,
  IV: string,
  EncryptedData: string,
  privateKeyPem: string
): Promise<any> {
  const encryptedAesKey = Uint8Array.from(atob(EncryptedAesKey), c =>
    c.charCodeAt(0)
  );
  const iv = Uint8Array.from(atob(IV), c => c.charCodeAt(0));
  const encryptedData = Uint8Array.from(atob(EncryptedData), c =>
    c.charCodeAt(0)
  );

  const privateKey = await pemToCryptoKey(privateKeyPem);

  const aesKeyRaw = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedAesKey
  );

  const aesKey = await crypto.subtle.importKey(
    'raw',
    aesKeyRaw,
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    aesKey,
    encryptedData
  );

  const decoder = new TextDecoder();
  console.log('decrypted', decoder.decode(decrypted));
  return JSON.parse(decoder.decode(decrypted));
}

export default function BlackMarket() {
  const isMounted = useIsMounted();
  const { userSession } = useAuth();
  const { gas, resetState } = useRootStore(state => state);

  // First useEffect - cleanup
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  // Second useEffect - data fetching
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       console.log('1');
  //       const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
  // MIICWwIBAAKBgQDGgGQU9hvK95ah7kmNqERMtEixfaeLIw7D/7X+AJz0V75E7KBZ
  // nTbN6nyTcx4zuJUV+fWhmIYx2c48YnXc2VMoPNuXteCOtvPwLxxAXuoFb8PZcHNc
  // 2Ps3RarmxdWjC4bbnM1AQwMoATpV3dGjBOJYHoGVFC1YhR7rEd+T6HRzwQIDAQAB
  // AoGAMsdTUt1mXLSbbw8i977sweZ4lhb7zicItvDqIHENtZ/gh4c0udfy1hg/CAUx
  // 269DTBzmThFTetsp296gIf/iOnv0oZ0pKE9ccbAqzUK1NQKpVuuyNOnIcsgWEYNY
  // XBEWAABq4M9Hooimq1qvE8meKYSPU0ICqt6CE1io7CfxLIUCQQD5PHRZRWccQJLE
  // w5ZvvgIadRxKj37lueoyjfOKdW2dqashJXbF0AVr7o0kXs2RGpAhbC+B8ig354nR
  // D67cruWrAkEAy+N2V3LGHQClKMzoNmI10Us7sG6ZnhbbfSo15N+s9Ic/vx6lAcBD
  // LhlRI+8vSi+ZZ4RpagLrwJi6T7I2e4MIQwJAT4JMr6nnUej7qU+n7y/TZfNUOij6
  // 13hu0P/d4J7DgFd/I0zbThGlmR/54M9pjs/FiRQFN9Qzplnz6kCxjO8yjwJAQZSw
  // hABO6RVECpOePZ/pX6CrWly43LjNcL0bCLtJjn3Sa08YFDAba8CI8N4Gf/4/gaR9
  // o7O80P5PL0NLcv76sQJAQ7/1gJHDIY/eO7onmVOwulHbhIgbDiarLBz0X2pVmsju
  // stlXcAqMFQYFQyRU0SMxq5ixnHYiXnUpJcnCUujIZA==
  // -----END RSA PRIVATE KEY-----`;
  //       console.log('2');
  //       const serverResponse = {
  //         code: 20000,
  //         message: 'Success',
  //         data: {
  //           encryptedAesKey:
  //             'Tv1UT7D0htUWjMenI7ubBrW88FUWWzYEdTnVIzVN4ulGu1cRabKMhxUuteMtAuLdQ7EmFzU3JLalprO0kIjP5qThGbJoXKaRuuKdIy7YdrIKuafH5a/OH5e2RIp8vrCefkMnJfkW7bPgQ1m9KXZPycsJmLsRh4yko8bg1xEAgDc=',
  //           iv: 'o7JIJHu79V8DpiUBPGaO6g==',
  //           encryptedData:
  //             '8tA5P0Zo8Ni+pF0YbYKzZPNYOK8Wig29qSeqA9+q5lQMw9Qts3TM0/m5cEylX1Bq1CxWmdo8lE2vLFhqtC3r0I6si5aX9CM5m7Aj5ksnBL8lD14e70s1DDHXPQLVeql7tDCkqt0ks12h9RHrOVg3UUYrCl3C7jyZlVYB8Xp0XtAzWMQ/6GJpMPczBnfcZGqtHh18cp6uSAiX19Uiedc6bMiN+/zAaIXTEDlW2ZuYohxhDpHIqcQllHhmvLQMG2WdES7GbeS05HSNPv55ofhQWcoCeV57p7AmZqvmtlPWOIh2hmElin1MfadI9mLJ4TUvWhgpYTTfSlGFenA+X0eiIC5TDSGwdMNfDj4QeN81FticOaeMpzV+hVL3v8jlGJTrCT4l0Oui8JaJNjhZFNrBVRZFafE669Bo1yL65CzRuPonB0TysnhwdwJ/wI48Q68AqrFWDPRL3jopdia88Fsu+mQzqRQ7ZdyZ8qdiMJsYM/mMFWbCPZaPgrGft9eUh1iXJM6wSKeHijDyPIy6T9y4G9OBIuDHjxlJTpC7MdiU4PMriKSPwQPYopBD/zFFr7ib3QYE5R1kwuaDAVkMgvfMcwukOPbyIndHbPIiU0GdNH1pgygqAh/qX4quhzrwnJqDsbS13SDr7+yy91nOLNi4xGJtzwmYANAyQLwQc0MJHVz6b1Q7UMUoSy+OoUuJrmTHTiGPF9vu6MGnSLYC10CaKGY/ppvlxN/xyCtHn0/46hfScxErSKXF/11kG9g6nO0sokT6N4vbA4VmQTHnx0oHwDKHNmPTMng6jy1cmaIGlMNXYRKLz/ilLTEbCxXXrk6yYev+J/7fOBCaaFEqz0vnqDw29/S+I17ep0iUF13AAJ4=',
  //         },
  //       };
  //       const response = await decryptLoginResponse(
  //         serverResponse.data.encryptedAesKey,
  //         serverResponse.data.iv,
  //         serverResponse.data.encryptedData,
  //         privateKeyPem
  //       );
  //       console.log('response', response);
  //       return response;
  //     };
  //     fetchData();
  //   });

  //   useEffect(() => {
  //     const runDecryption = async () => {
  //       const data = {
  //         encryptedAesKey:
  //           'Ke6SCHgrPnKG4bl66wrD7cohKgV9E1oRPOen2XFFBzvgEHNbxL1eyZuVVr+...',
  //         iv: 'vXBZjav4fngGS4ZdrYZOsQ==',
  //         encryptedData: '09+YuMVMBWSyT4cNyxGjDNAJYo9phH9vtH6j+BzQI3rhEJ...',
  //       };

  //       const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
  // MIICWwIBAAKBgQDGgGQU9hvK95ah7kmNqERMtEixfaeLIw7D/7X+AJz0V75E7KBZ
  // nTbN6nyTcx4zuJUV+fWhmIYx2c48YnXc2VMoPNuXteCOtvPwLxxAXuoFb8PZcHNc
  // 2Ps3RarmxdWjC4bbnM1AQwMoATpV3dGjBOJYHoGVFC1YhR7rEd+T6HRzwQIDAQAB
  // AoGAMsdTUt1mXLSbbw8i977sweZ4lhb7zicItvDqIHENtZ/gh4c0udfy1hg/CAUx
  // 269DTBzmThFTetsp296gIf/iOnv0oZ0pKE9ccbAqzUK1NQKpVuuyNOnIcsgWEYNY
  // XBEWAABq4M9Hooimq1qvE8meKYSPU0ICqt6CE1io7CfxLIUCQQD5PHRZRWccQJLE
  // w5ZvvgIadRxKj37lueoyjfOKdW2dqashJXbF0AVr7o0kXs2RGpAhbC+B8ig354nR
  // D67cruWrAkEAy+N2V3LGHQClKMzoNmI10Us7sG6ZnhbbfSo15N+s9Ic/vx6lAcBD
  // LhlRI+8vSi+ZZ4RpagLrwJi6T7I2e4MIQwJAT4JMr6nnUej7qU+n7y/TZfNUOij6
  // 13hu0P/d4J7DgFd/I0zbThGlmR/54M9pjs/FiRQFN9Qzplnz6kCxjO8yjwJAQZSw
  // hABO6RVECpOePZ/pX6CrWly43LjNcL0bCLtJjn3Sa08YFDAba8CI8N4Gf/4/gaR9
  // o7O80P5PL0NLcv76sQJAQ7/1gJHDIY/eO7onmVOwulHbhIgbDiarLBz0X2pVmsju
  // stlXcAqMFQYFQyRU0SMxq5ixnHYiXnUpJcnCUujIZA==
  // -----END RSA PRIVATE KEY-----`;

  //       try {
  //         const result = await decryptHybridData(
  //           data.encryptedAesKey,
  //           data.iv,
  //           data.encryptedData,
  //           privateKeyPem
  //         );

  //         console.log('Decrypted result:', result);
  //       } catch (err) {
  //         console.error('Decryption failed', err);
  //       }
  //     };

  //     runDecryption();
  //   }, []);

  useEffect(() => {
    const run = async () => {
      const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDGgGQU9hvK95ah7kmNqERMtEixfaeLIw7D/7X+AJz0V75E7KBZ
nTbN6nyTcx4zuJUV+fWhmIYx2c48YnXc2VMoPNuXteCOtvPwLxxAXuoFb8PZcHNc
2Ps3RarmxdWjC4bbnM1AQwMoATpV3dGjBOJYHoGVFC1YhR7rEd+T6HRzwQIDAQAB
AoGAMsdTUt1mXLSbbw8i977sweZ4lhb7zicItvDqIHENtZ/gh4c0udfy1hg/CAUx
269DTBzmThFTetsp296gIf/iOnv0oZ0pKE9ccbAqzUK1NQKpVuuyNOnIcsgWEYNY
XBEWAABq4M9Hooimq1qvE8meKYSPU0ICqt6CE1io7CfxLIUCQQD5PHRZRWccQJLE
w5ZvvgIadRxKj37lueoyjfOKdW2dqashJXbF0AVr7o0kXs2RGpAhbC+B8ig354nR
D67cruWrAkEAy+N2V3LGHQClKMzoNmI10Us7sG6ZnhbbfSo15N+s9Ic/vx6lAcBD
LhlRI+8vSi+ZZ4RpagLrwJi6T7I2e4MIQwJAT4JMr6nnUej7qU+n7y/TZfNUOij6
13hu0P/d4J7DgFd/I0zbThGlmR/54M9pjs/FiRQFN9Qzplnz6kCxjO8yjwJAQZSw
hABO6RVECpOePZ/pX6CrWly43LjNcL0bCLtJjn3Sa08YFDAba8CI8N4Gf/4/gaR9
o7O80P5PL0NLcv76sQJAQ7/1gJHDIY/eO7onmVOwulHbhIgbDiarLBz0X2pVmsju
stlXcAqMFQYFQyRU0SMxq5ixnHYiXnUpJcnCUujIZA==
-----END RSA PRIVATE KEY-----`;

      try {
        const loginData = await fetchAndDecryptToken(privateKeyPem);
        console.log('✅ Token decrypted:', loginData);
      } catch (err) {
        console.error('❌ Failed to decrypt token:', err);
      }
    };

    run();
  }, []);
  if (!userSession) {
    return <h1>Sign in to interact with custom extrinsics</h1>;
  }

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1>View Assets on your wallet:</h1>

      <div className="grid grid-flow-col grid-cols-2 gap-4 w-full">
        <div className="w-full">
          <ViewAssets />
        </div>
        <div className="w-full">
          <ViewAssetsFromGame />
        </div>
      </div>
      <div className="auto-grid">
        {gas && (
          <div className="w-full">
            <TransactionDetails />
          </div>
        )}
      </div>
    </div>
  );
}
