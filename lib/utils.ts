import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a PIN to a cryptographic key
 * @param pin The 4-digit PIN to convert
 * @returns A Promise that resolves to a CryptoKey
 */
export async function pinToKey(pin: string): Promise<CryptoKey> {
  // Convert PIN to UTF-8 encoded array buffer
  const encoder = new TextEncoder();
  const pinData = encoder.encode(pin.padEnd(16, pin)); // Pad pin to reach minimum required length
  
  // Import the PIN as a key
  return await crypto.subtle.importKey(
    'raw',
    pinData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-GCM encryption
 * @param data String data to encrypt
 * @param pin PIN to use for encryption
 * @returns Promise resolving to the encrypted data as a Base64 string
 */
export async function encryptData(data: string, pin: string): Promise<string> {
  try {
    const key = await pinToKey(pin);
    
    // Create a random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encode data to UTF-8
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // Convert to Base64 string, but first combine IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to Base64
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(result))));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data encrypted with encryptData
 * @param encryptedData Base64 encrypted data string
 * @param pin PIN used for encryption
 * @returns Promise resolving to the decrypted string
 */
export async function decryptData(encryptedData: string, pin: string): Promise<string> {
  try {
    // Convert Base64 to array buffer
    const encryptedBytes = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // Extract IV and actual encrypted data
    const iv = encryptedBytes.slice(0, 12);
    const data = encryptedBytes.slice(12);
    
    // Generate key from PIN
    const key = await pinToKey(pin);
    
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Decode UTF-8
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Incorrect PIN or corrupted data.');
  }
}

/**
 * Check if a string is encrypted (basic heuristic)
 * @param str String to check
 * @returns Boolean indicating if string is likely encrypted
 */
export function isEncrypted(str: string): boolean {
  try {
    // Check if the string is base64 encoded
    const validBase64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!validBase64Regex.test(str)) return false;
    
    // Try to decode as base64
    const decoded = atob(str);
    
    // Check if it starts with a byte sequence that could be an IV
    // This is just a heuristic
    const nonPrintable = decoded.slice(0, 12).split('').filter(
      char => char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126
    ).length;
    
    return nonPrintable > 5; // If most of the first 12 chars are non-printable, it's likely an IV
  } catch (e) {
    return false; // Not base64 encoded
  }
}
