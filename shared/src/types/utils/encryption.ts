import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { scryptSync } from 'crypto';

export interface EncryptedConfig {
  version: 1;
  algorithm: 'aes-256-gcm';
  salt: string;
  iv: string;
  authTag: string;
  encrypted: string;
  timestamp: number;
}

export class ConfigEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly SALT_LENGTH = 16;
  private static readonly IV_LENGTH = 16;
  private static readonly KEY_LENGTH = 32;

  static encryptConfig(config: any, passphrase: string): EncryptedConfig {
    const salt = randomBytes(this.SALT_LENGTH);
    const iv = randomBytes(this.IV_LENGTH);

    const key = scryptSync(passphrase, salt, this.KEY_LENGTH);

    const plaintext = JSON.stringify(config);
    const cipher = createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      version: 1,
      algorithm: this.ALGORITHM,
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encrypted,
      timestamp: Date.now()
    };
  }

  static decryptConfig(encrypted: EncryptedConfig, passphrase: string): any {
    if (encrypted.version !== 1) {
      throw new Error(`Unsupported encryption version: ${encrypted.version}`);
    }

    const salt = Buffer.from(encrypted.salt, 'base64');
    const iv = Buffer.from(encrypted.iv, 'base64');
    const authTag = Buffer.from(encrypted.authTag, 'base64');

    const key = scryptSync(passphrase, salt, this.KEY_LENGTH);

    try {
      const decipher = createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error('Decryption failed - invalid passphrase or corrupted data');
    }
  }

  static validatePassphrase(passphrase: string): {
    score: number;
    valid: boolean;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (passphrase.length >= 12) {
      score += 20;
    } else if (passphrase.length >= 8) {
      score += 10;
      feedback.push('Use at least 12 characters for better security');
    } else {
      feedback.push('Passphrase must be at least 8