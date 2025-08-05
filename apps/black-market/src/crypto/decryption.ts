import forge from 'node-forge';

export class TokenDecryption {
  private privateKey: forge.pki.rsa.PrivateKey;

  constructor(privateKeyPem: string) {
    this.privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  }

  /**
   * Giải mã token từ response server
   * @param encryptionResponse - Object chứa EncryptedAesKey, IV, EncryptedData
   * @returns Dữ liệu JSON sau khi giải mã
   */
  async decryptTokenResponse(encryptionResponse: {
    encryptedAesKey: string;
    iv: string;
    encryptedData: string;
  }): Promise<any> {
    try {
      const { encryptedAesKey, iv, encryptedData } = encryptionResponse;

      const encryptedAesKeyBytes = forge.util.decode64(encryptedAesKey);
      const ivBytes = forge.util.decode64(iv);
      const encryptedDataBytes = forge.util.decode64(encryptedData);

      const aesKeyBytes = this.privateKey.decrypt(
        encryptedAesKeyBytes,
        'RSA-OAEP',
        {
          md: forge.md.sha256.create(),
          mgf1: {
            md: forge.md.sha256.create(),
          },
        }
      );

      const decipher = forge.cipher.createDecipher('AES-CBC', aesKeyBytes);
      decipher.start({ iv: ivBytes });
      decipher.update(forge.util.createBuffer(encryptedDataBytes));
      const success = decipher.finish();

      if (!success) throw new Error('AES decryption failed');

      const decryptedJson = decipher.output.toString();
      return JSON.parse(decryptedJson);
    } catch (error: any) {
      throw new Error(
        `Decryption failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export async function fetchAndDecryptToken(
  privateKeyPem: string
): Promise<any> {
  try {
    const response = await fetch('/api/encryption-token', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer your-current-token',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const encryptionResponse = await response.json();

    const decoder = new TokenDecryption(privateKeyPem);
    const loginResponse = await decoder.decryptTokenResponse(
      encryptionResponse
    );

    localStorage.setItem('accessToken', loginResponse.accessToken);
    localStorage.setItem('refreshToken', loginResponse.refreshToken);

    return loginResponse;
  } catch (error: any) {
    console.error('Error fetching and decrypting token:', error);
    throw error;
  }
}
