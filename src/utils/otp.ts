import { randomInt } from 'node:crypto';

export const OTP_LENGTH = 6;

export function generateOTP(length = OTP_LENGTH): string {
  if (!Number.isInteger(length) || length < 4 || length > 10) {
    throw new RangeError('OTP length phải trong khoảng 4-10');
  }

  return randomInt(0, 10 ** length)
    .toString()
    .padStart(length, '0');
}
