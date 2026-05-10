import jwt from "jsonwebtoken";

export function getAdminSession(cookieStore: any) {
  try {
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any;
    if (decoded.role === "ADMIN") return decoded;
    return null;
  } catch (e) {
    return null;
  }
}
