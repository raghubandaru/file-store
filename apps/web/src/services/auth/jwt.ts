import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { userId: string };
}
