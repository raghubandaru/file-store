import { verifyAccessToken } from "./jwt";

export function requireAuth(request: Request) {
  const header = request.headers.get("authorization");

  if (!header) throw new Error("Unauthorized");

  const token = header.split(" ")[1];

  const payload = verifyAccessToken(token);

  return payload.userId;
}
