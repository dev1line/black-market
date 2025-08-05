import forge from 'node-forge';

export interface EncryptedToken {
  EncryptedAesKey: string;
  IV: string;
  EncryptedData: string;
}

export class TokenEncryption {
  private publicKey: forge.pki.rsa.PublicKey;

  /**
   * Khởi tạo bộ mã hóa với khóa công khai RSA
   * @param publicKeyPem - Khóa công khai dạng PEM
   */
  constructor(publicKeyPem: string) {
    this.publicKey = forge.pki.publicKeyFromPem(
      publicKeyPem
    ) as forge.pki.rsa.PublicKey;
  }

  /**
   * Mã hóa dữ liệu token response
   * @param tokenData - Dữ liệu token cần mã hóa
   * @returns Promise<{EncryptedAesKey: string, IV: string, EncryptedData: string}>
   */
  async encryptTokenResponse(tokenData: object): Promise<EncryptedToken> {
    try {
      // 1. Tạo khóa AES ngẫu nhiên (256-bit) và IV
      const aesKey = forge.random.getBytesSync(32);
      const iv = forge.random.getBytesSync(16);

      // 2. Mã hóa dữ liệu bằng AES-CBC
      const jsonData = JSON.stringify(tokenData);
      const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
      cipher.start({ iv });
      cipher.update(forge.util.createBuffer(jsonData, 'utf8'));
      cipher.finish();
      const encryptedData = cipher.output.getBytes();

      // 3. Mã hóa khóa AES bằng RSA-OAEP
      const encryptedAesKey = this.publicKey.encrypt(aesKey, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create(),
        },
      });

      // 4. Trả về kết quả dưới dạng base64
      return {
        EncryptedAesKey: forge.util.encode64(encryptedAesKey),
        IV: forge.util.encode64(iv),
        EncryptedData: forge.util.encode64(encryptedData),
      };
    } catch (error: any) {
      const err = new Error(`Encryption failed: ${error.message}`);
      (err as any).cause = error;
      throw err;
    }
  }
}
