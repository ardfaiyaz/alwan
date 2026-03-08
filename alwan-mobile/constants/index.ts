export * from './routes';
export * from './colors';

export const APP_CONFIG = {
  name: 'KMBI Alwan',
  version: '1.0.0',
  phonePrefix: '+63',
  otpLength: 6,
  pinLength: 5,
  otpTimeout: 60, // seconds
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['image/*', 'application/pdf'],
} as const;

export const VALIDATION = {
  phoneNumberLength: 10,
  minNameLength: 2,
  minAddressLength: 10,
} as const;
