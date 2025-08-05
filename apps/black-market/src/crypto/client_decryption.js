const forge = require('node-forge');

class TokenDecryption {
    constructor(privateKeyPem) {
        this.privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    }

    async decryptTokenResponse(encryptionResponse) {
        try {
            const { EncryptedAesKey, IV, EncryptedData } = encryptionResponse;

            // Decode base64 strings
            const encryptedAesKeyBytes = forge.util.decode64(EncryptedAesKey);
            const ivBytes = forge.util.decode64(IV);
            const encryptedDataBytes = forge.util.decode64(EncryptedData);

            // DEBUG: Log kích thước dữ liệu
            console.log(`[DEBUG] EncryptedAesKey size: ${encryptedAesKeyBytes.length} bytes`);
            console.log(`[DEBUG] IV size: ${ivBytes.length} bytes`);
            console.log(`[DEBUG] EncryptedData size: ${encryptedDataBytes.length} bytes`);


            const aesKeyBytes = this.privateKey.decrypt(encryptedAesKeyBytes, 'RSA-OAEP', {
                md: forge.md.sha256.create(),
                mgf1: {
                    md: forge.md.sha256.create()
                }
            });

            // Giải mã dữ liệu bằng AES-CBC
            const decipher = forge.cipher.createDecipher('AES-CBC', aesKeyBytes);
            decipher.start({ iv: ivBytes });
            decipher.update(forge.util.createBuffer(encryptedDataBytes));

            if (!decipher.finish()) {
                throw new Error('AES decryption failed');
            }

            // Parse JSON kết quả
            return JSON.parse(decipher.output.toString('utf8'));

        } catch (error) {
            // Bổ sung thông tin lỗi chi tiết
            const err = new Error(`Decryption failed: ${error.message}`);
            err.cause = error;
            throw err;
        }
    }
}

module.exports = { TokenDecryption };