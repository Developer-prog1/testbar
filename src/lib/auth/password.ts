import { hash, verify } from "@node-rs/argon2";

export const hashPassword = (plain: string): Promise<string> => hash(plain);

export const verifyPassword = (
  passwordHash: string,
  plain: string,
): Promise<boolean> => verify(passwordHash, plain);
