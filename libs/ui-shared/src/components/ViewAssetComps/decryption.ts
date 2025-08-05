import forge from 'node-forge';

export interface EncryptionResponse {
  encryptedAesKey: string;
  iv: string;
  encryptedData: string;
}

export class TokenDecryption {
  private privateKey: forge.pki.rsa.PrivateKey;

  constructor(privateKeyPem: string) {
    this.privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  }

  async decryptTokenResponse(
    encryptionResponse: EncryptionResponse
  ): Promise<any> {
    try {
      const { encryptedAesKey, iv, encryptedData } = encryptionResponse;

      const encryptedAesKeyBytes = forge.util.decode64(encryptedAesKey);
      const ivBytes = forge.util.decode64(iv);
      const encryptedDataBytes = forge.util.decode64(encryptedData);

      console.log(
        `[DEBUG] EncryptedAesKey size: ${encryptedAesKeyBytes.length} bytes`
      );
      console.log(`[DEBUG] IV size: ${ivBytes.length} bytes`);
      console.log(
        `[DEBUG] EncryptedData size: ${encryptedDataBytes.length} bytes`
      );

      const aesKeyBytes = this.privateKey.decrypt(
        encryptedAesKeyBytes,
        'RSA-OAEP',
        {
          md: forge.md.sha256.create(),
          mgf1: { md: forge.md.sha256.create() },
        }
      );

      const decipher = forge.cipher.createDecipher('AES-CBC', aesKeyBytes);
      decipher.start({ iv: ivBytes });
      decipher.update(forge.util.createBuffer(encryptedDataBytes));

      if (!decipher.finish()) {
        throw new Error('AES decryption failed');
      }

      return JSON.parse(decipher.output.toString());
    } catch (error: any) {
      const err = new Error(`Decryption failed: ${error?.message ?? error}`);
      (err as any).cause = error;
      throw err;
    }
  }
}
