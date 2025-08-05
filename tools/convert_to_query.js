const fs = require('fs');
const path = require('path');

// Lấy tên file từ tham số dòng lệnh, mặc định là response-backend.json
const fileName = process.argv[2] || 'response-backend.json';
const filePath = path.resolve(__dirname, fileName);

try {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const params = ['encryptedAesKey', 'iv', 'encryptedData'];
  const query =
    '?' +
    params
      .map(key => `${key}=${encodeURIComponent(data[key] || '')}`)
      .join('&');
  console.log(query);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
