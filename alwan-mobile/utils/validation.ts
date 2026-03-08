import { VALIDATION } from '@/constants';

export const validatePhoneNumber = (phone: string): boolean => {
  return phone.length === VALIDATION.phoneNumberLength && /^\d+$/.test(phone);
};

export const validatePin = (pin: string): boolean => {
  return pin.length === 5 && /^\d+$/.test(pin);
};

export const validateOtp = (otp: string): boolean => {
  return otp.length === 6 && /^\d+$/.test(otp);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= VALIDATION.minNameLength;
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= VALIDATION.minAddressLength;
};

export const formatPhoneNumber = (phone: string): string => {
  // Format: 9XX XXX XXXX
  if (phone.length <= 3) return phone;
  if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
};

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
