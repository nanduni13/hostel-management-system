import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain, hashed) {
  if (!hashed) return false;
  if (hashed.startsWith("$2")) {
    return bcrypt.compare(plain, hashed);
  }
  return plain === hashed;
}
