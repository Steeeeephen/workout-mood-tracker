import "dotenv/config";
import jwt from "jsonwebtoken";

export interface TokenPayload extends jwt.JwtPayload {
  userId: number;
  // Missing on tokens issued before versioning existed; treated as 0.
  tokenVersion?: number;
}

const algorithm = "HS256";

export const signToken = (user: { id: number; token_version: number }) =>
  jwt.sign(
    { userId: user.id, tokenVersion: user.token_version },
    process.env.JWT_SECRET!,
    { expiresIn: "24h", algorithm },
  );

// Throws if the token is malformed, expired, or signed with another secret.
export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!, {
    algorithms: [algorithm],
  }) as TokenPayload;
