const { TokenDecryption } = require('./client_decryption');

async function testTokenDecryption() {
    console.log('🚀 Starting TokenDecryption test...\n');

    const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAi5Zxl4ZANumBXGNlMaJVmAC7UgMMXrB0vn00sxBeTov/RQ5A
27zo9nXY3ZrPehgRCWeyuc46FFiy/qhZNz2Te6NyuYm2LNdXUPvW9ymUOF65rFkS
fr1H2kQFoN3btin9owr8Jcq38dnKhK0N1drqG2NZCgMLv1X9sTuu3bodZPXGFzF0
5fXAbCyf7w4AwbnVuhz4QuLeN4yy9Xy0gOAmPVOWBBFrGMrOWaopKxRUg/XbVnl1
CTzuOiEMGMTihcLqkMiTToGK1kXcTwS3+LUMaUyjUj+U7mf/xfdXAa5Mk9gFNkgm
cgnSA6vQWI1TvEbnMt35vWIyC+WdBnScgNQVyQIDAQABAoIBAQCKpfxeTXMrF/Tu
F6xECMKMIO3vICgBRbQwIZ1e3ztNObFsniO+H34mkBfAxiyfUZhahy33cOgvnYrt
d7pmLDt563fg4vCYyaxpPDzhc+NNuokir7a3PLtKCZatmrDJ2Bue/yJFR34+M938
uwerC67NVXjzgOMCQh+jE201v8/CnwWDSkagOeN6I2XtyJsN8ZW4gOYDfQoDfl/1
ilefcQLTibvb46xU30rP33XwlLuLzggrxA95PJTeGjS9uLEup1+HibdMFYECQ0KH
rebNInBq13//Jloq+yca5YqBOrn3I7BNbdWkcSjpQbJZI/iKZN3VbXR7J8apNo2T
gAb2tlwBAoGBAL0kZHJ7pKZ4n6vhcaX46uqJFis+kRh6DfpbHGCmwUjrTCusL28l
Xlvp/H8s1BL4ImV7KHnJDps42Ez4Sm6zgFeWKprCz5pMpVrLmBAzVqvNEOTFZhCe
QIdAgeXZn9E3xljKqNcvIUxlvlFKr3KYQH9QF7vjB6STsFWREVe7Pf65AoGBALzt
1K2uLTiUKiIjo66KNrHkdJMsg847jwEjIRH3GAdNo07jEa20ZH0Sy7/j2DKRi7aQ
vJDsIc9kZAMldZSLJ87KggmzYVjtR4PEW9Re/Sv8gUtAByFkzaQKNPTrwZwKX5rs
bpBomoItmdOkalDVokOKAmNSJC4zee6quVY83ceRAoGBAJCl7EvBU0Icrb/9QbT0
kHOdM18PElftwBLe6uzfmqHxkOc1X3FY2rjgUUHRPr7jFSsW7PV2Vb1P09vJZuMS
U+yn4x1ILwyJ4Ut2uGxrVrU8tta+QDglTqQhKTZnIFoYlZACLO2kFYsfpFT3EQZK
ecjjr8L49Tdf21MVBnZZtCfBAoGAQGj41AmIozxoLOFnoU6/nOBdGfvYJ8xIUcPv
N1e9WmgOoAtr8IOKqtVon1AHWh4iuqgXkXTfhfwc2LHBp1XVyXti3/nG23Fxqyub
fwivWXqpfcUjaTAbp6xPJ5zkkdU7iO7INvVij7UKN4xbLpnWyx3W+JN9gD7OeB6+
NvdjSPECgYEAoouRtOPXzj4ovvXMQPaDJeCiHROKCf2zePgBQo9KME3jjP2JKwEk
j2gEupgSnbtxPPI35D7ALyIjBqH6kcHLBlNHDL8gA4sTB7GOQ3UZ2v3LN22winM4
bWkDxTtdPZZeJY3vbQeV14A93a9Ws+5qEJHN2Vgq24qX7Dxi988hx3c=
-----END RSA PRIVATE KEY-----
`;

    try {
        console.log('📝 Test 1: Khởi tạo TokenDecryption class');
        const decoder = new TokenDecryption(privateKeyPem);
        console.log('✅ TokenDecryption class được khởi tạo thành công\n');

        console.log('📝 Test 2: Giải mã token response');
        const encryptionResponse = {
            EncryptedAesKey: "Dtr23PHvh3RYZPdmJQ1poLulj7vl43NU+j569Y8XPDbnzX41lIFk/5xVbU+DVmFrm9XulGWs0xF8FcibJjvyx3F4KR1+OkKiJ1xvfl+hkYj/mAQuY4ezeLFduep9pCO2aXnGEeq5Qwrt3tdctMHNnOMVxaxT14/pRbV5YJ2TLDG+/nHjhusAzydsAQTOZmDl75pJty12J4nvgTWqsxuYRSf47MeJFrYuP9bY4622zozNL2apbCjLbqkyfv1yxUVtsED4VlI/X3gqkqsf+JG+657ug82sQrrB1w6eptKIoJhv8lexjqTbekJ92V8SG9SDOawNPQVnn+ZOLXiRXXrHbw==",
            IV: "EXMlkjtpT8id88PtBWgSAQ==",
            EncryptedData: "XjnHXloWlPVWZ105qMByGW87Bz07hV8+RHjGgJ7IjzIGZPiwS3fuE3tnO2IDvMg1fSG7EEpeMmY2e/uGFu5Vtq6UvOCcxxz3loXXS98QyaPFYHMYXZiZhPIttF2Gxs1ZTcSYxdcso8g+9q/5hIkS4qljc0TQ6bolkZ5yQQs9ydUqp+LiJQjtFwy+tvebfdlHuyAcHBq85MjGuwC91lIFJgN/HJXLSPj81HQIEBIxSqNlKfBWy6r4XCvtVY1suqaezakX4fZt15VOjCuogOUxNxF62hrJkLXN5Vmz+z6JfvRQTR8eB1CN/m0X0lm9KFj3i5xofFpM8XUF1uoX9cU9p4tcQzkKzqaa2CpDJo5uHkVwJWSIEz/NZ/I/6ceKbLJr7qPMsdG1SDm2MpJGKc6RKDt4kjz2qa3R0ghwqYmYROcW7JxclRghLf9wdISI8CPo41rTAw47TNNHxefNn3etGtUNcwPj3FpOFFBBIZ8H2DJpu/dsi8G3lzhkD0xmOjGqHpIPD5sV6aXw7SVgxyx0W3EJwyVL/wNNbS7L0/7oR/3WSZ9/+L1V0yLtth8J70Dkhp8lS2AF5cVYmwxLZgvTSIXPisbhJ9mxDvza5SrUEWFhraR5kDu+ujVL1OscRvboT818OcMuYKWtZCSIXw+qet10Pz3YpEBre7WK2mlKc6zbhLDAxfcE2g65afIku1NRFcMsQWucQ7OKYhEwdM4lGU3xTaLyDRD1N9leGvG9a6xtnXo+UM/oxFeUEgfSDM8WG97BkgFBcOjMdmZNau1SKoDe/FJ/bxpXZFtBW8MWo7K3KNLttKzZ7tADF6h+fI2JO/sveC3X1uXBFw23iZnaglzk4JSRBLtyEUgIP9Jp/zk="
        };

        const loginResponse = await decoder.decryptTokenResponse(encryptionResponse);

        console.log('✅ Giải mã thành công!');
        console.log('📊 Kết quả giải mã:');
        console.log(loginResponse);
        console.log();

        // ... (các kiểm tra cấu trúc dữ liệu) ...

    } catch (error) {
        console.error('❌ Test thất bại:', error.message);
        console.error('📝 Chi tiết lỗi:', error.cause || error);
    }
}

testTokenDecryption().then(() => {
    console.log('\n🏁 Test hoàn thành!');
}).catch((error) => {
    console.error('\n💥 Test bị lỗi:', error);
});