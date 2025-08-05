const { TokenEncryption } = require('./client_encryption');

async function testTokenEncryption() {
    console.log('🚀 Starting TokenEncryption test...\n');

    // Sử dụng public key trực tiếp
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBrZxOXi53gV1+4D6WD/g4v
MdK1HI1kCfoRweqGPBU4a1vAK4q/rqV+PPcucjPmImVbnFAa/v9+FSa3vbjVfxF4
ZpHddCBW/G36coGDu/8tFsLwCGTg86FOieHljduQ2iz6jiF2Ci5aOZZeEknp05f5
6YlEosNgBd6O2OwA4q+mze0Y/c4r4iQyVVbKXiqBm4+YKEBH1WUY0s4d3qDNVj0u
WV393054eccYJN7fBbDLG+gBL2k6sqc8wNMJeDD9bo06UJc5F/rMfAlJlO2yjNyA
/XQCYafAAYtjLTEuuhgdfsBiAt3FkssVCzIOrW39/Y1S1QIUD5we+pxSRL2g8qmz
AgMBAAE=
-----END PUBLIC KEY-----`;

    try {
        console.log('📝 Test 1: Khởi tạo TokenEncryption class');
        const encoder = new TokenEncryption(publicKeyPem);
        console.log('✅ TokenEncryption class được khởi tạo thành công\n');

        console.log('📝 Test 2: Mã hóa dữ liệu token');
        const tokenData =  {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVSURfNjg4MzRiZDVjMzQ0NDZkZDNlNTQyOGUyIiwiZW1haWwiOiJtZW9tZW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJzZXNzaW9uSWQiOlsiMzcxZGQ1Y2MtODljNy00MDA4LWFkNjMtYzg3NWMwMDcyNzc1IiwiMzcxZGQ1Y2MtODljNy00MDA4LWFkNjMtYzg3NWMwMDcyNzc1Il0sImp0aSI6IjA4NzdiY2FlLTFjYmYtNDkwZC1iNWQxLWE3ZDhhMjE3MjkwNSIsImV4cCI6MTc1MzY3MDQ2MiwiaXNzIjoiQW5pbWFsR29CYWNrRW5kIiwiYXVkIjoiQW5pbWFsR29DbGllbnQifQ.m0vlW2p-nnjJJethTRihAcxCUmDZ82IGDacYu-gtdIk",
            refreshToken: "CcJC7XMrdEeYR/S4MROc/A==oXCmCsu/hE2jgx7kEgYHgQ==",
            accessTokenExpiry: "2025-07-28T02:41:02.3427916Z",
            refreshTokenExpiry: "2025-08-04T01:41:02.342792Z"
        };

        const encryptionResponse = await encoder.encryptTokenResponse(tokenData);

        console.log('✅ Mã hóa thành công!');
        console.log('📊 Kết quả mã hóa:');
        console.log(encryptionResponse);
        console.log();

        // Kiểm tra định dạng đầu ra
        console.log('🔍 Kiểm tra định dạng:');
        console.log('- EncryptedAesKey:', encryptionResponse.EncryptedAesKey.length > 100 ? 'Valid' : 'Invalid');
        console.log('- IV:', encryptionResponse.IV.length === 24 ? 'Valid' : 'Invalid'); // 16 bytes -> base64 24 chars
        console.log('- EncryptedData:', encryptionResponse.EncryptedData.length > 100 ? 'Valid' : 'Invalid');

    } catch (error) {
        console.error('❌ Test thất bại:', error.message);
        console.error('📝 Chi tiết lỗi:', error.cause || error);
    }
}

testTokenEncryption().then(() => {
    console.log('\n🏁 Test hoàn thành!');
}).catch((error) => {
    console.error('\n💥 Test bị lỗi:', error);
});