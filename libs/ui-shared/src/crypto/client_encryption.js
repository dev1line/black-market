const forge = require('node-forge');

class TokenEncryption {
    /**
     * Khởi tạo bộ mã hóa với khóa công khai RSA
     * @param {string} publicKeyPem - Khóa công khai dạng PEM
     */
    constructor(publicKeyPem) {
        this.publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    }

    /**
     * Mã hóa dữ liệu token response
     * @param {object} tokenData - Dữ liệu token cần mã hóa
     * @returns {Promise<{EncryptedAesKey: string, IV: string, EncryptedData: string}>}
     */
    async encryptTokenResponse(tokenData) {
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
                    md: forge.md.sha256.create()
                }
            });

            // 4. Trả về kết quả dưới dạng base64
            return {
                EncryptedAesKey: forge.util.encode64(encryptedAesKey),
                IV: forge.util.encode64(iv),
                EncryptedData: forge.util.encode64(encryptedData)
            };
            
        } catch (error) {
            const err = new Error(`Encryption failed: ${error.message}`);
            err.cause = error;
            throw err;
        }
    }
}
module.exports = { TokenEncryption };
