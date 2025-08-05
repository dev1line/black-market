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
    encryptedAesKey: 'QhykWFecl/kkLztOMVbimE7QKlMypKoXSxW9AzdfTjkcdYGnMvGEYgCog8xtQ5rVQf6jH1uKkqcBGdyxiL+PQp4MeQRGoLvo4ayC6mHH+hFqnBjDhVlY1JsCWqDl+PpNePuLBgyS3DEeBv4WxNW0qBn2oxfW4cpAIir37yVLMcC5bxH+pl2w9KcGTwoifT+Ysz2TRXhTgtF/QbeYHDDH4R7TtmfrIWaMk7nlBYQP6Jfkw4RV13EujAJapfP+bWLYX3ew/qt8iyZBgmmyXF6YQx9ESuyJFwQh61PGu/1ocnUlWNrYd9nhU95KiUaNhbNLA2OhXaOYw8i4wlckGIglaw==';
    encryptedData: 'ryq1TnUNKk9fj8UHmQkwESEBBANLWKj5L0ysuaTUKIxrVo5uOeYCOanj7elsvsGNqobPWkBh9Tg8eyuZe5P3OmOvXF73jgZ8fKzz0X7+u6K17PJcjdY2/cJXwl4J7oJG';
    iv: 'Y4CaGYgyp5FpNc58zjOSHw==';
    const encryptionResponse = {
      EncryptedAesKey:
        'OiaImUtu8GOapljcm1KnzhPiNwKNPmWYAJZxUEDE4upmQbugMkL5BsSAeRKtNLLyE2hdGEvkFWqCEInkEVVnihIaD+cWGXhC1pYVSkpCtFvzGioQBMypR+ou7cmjB1+mQIN4e2M2lqDPIDTzrVKzEIRSd7lx6Zrj222nTLR5YV+Jnl1woCHzAlDmSTHarz32b9C695dH1x+/UsY+Yz8golvPnLujk4bfQ3PvCRoXoMCpSX+VEAFu3y5uK1qubHEipxC9IaOnAwdJSJ1o93eFQS40PxeRIx3SHrm7sLB7vfQpAaRV44hSjMtCvafl/OXF4A0x656xT8ZOuZrsG72KEg==',
      IV: '11HuvB6rZ3BMw0Y8LCIdtg==',
      EncryptedData:
        'VA1cqU6eFDAuJI4vhz9sBo5bJyY0k3iJTMcTD6gcqueOBoDl3P0J/riH+G8MKvMUXgqf3Y287ykNKT3SLTM5aSGntsNyAwNIAEiM1ZVooEg=',
    };

    const loginResponse = await decoder.decryptTokenResponse(
      encryptionResponse
    );

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

testTokenDecryption()
  .then(() => {
    console.log('\n🏁 Test hoàn thành!');
  })
  .catch(error => {
    console.error('\n💥 Test bị lỗi:', error);
  });
