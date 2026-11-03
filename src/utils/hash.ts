import brypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string) => brypt.hash(plain, SALT_ROUNDS);

export const comparePassword = (plain: string, hash: string) =>
  brypt.compare(plain, hash);
