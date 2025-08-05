// utils/decryptHybrid.ts

function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  return base64ToUint8Array(b64).buffer;
}

export async function decryptHybridData(
  encryptedAesKey: string,
  iv: string,
  encryptedData: string,
  privateKeyPem: string
): Promise<any> {
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPem),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );

  const aesKeyRaw = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    base64ToUint8Array(encryptedAesKey)
  );

  const aesKey = await crypto.subtle.importKey(
    'raw',
    aesKeyRaw,
    { name: 'AES-CBC' }, // hoặc 'AES-GCM' nếu server dùng GCM
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: base64ToUint8Array(iv),
    },
    aesKey,
    base64ToUint8Array(encryptedData)
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}
