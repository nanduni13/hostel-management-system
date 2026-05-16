import jwt from "jsonwebtoken";

function getToken(req) {
  const header = req.headers.authorization?.trim();
  if (!header) return null;
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim().replace(/^["']|["']$/g, "");
  }
  // Allow raw token without "Bearer " prefix (common Postman mistake)
  return header.replace(/^["']|["']$/g, "");
}

export function authMiddleware(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "student") {
      return res.status(403).json({
        error: "Admin access required. Use the token from POST /api/auth/login (admin), not student login.",
      });
    }
    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    const hint =
      err.name === "TokenExpiredError"
        ? "Token expired. Login again with POST /api/auth/login"
        : "Invalid token. Login again with POST /api/auth/login and copy the full token (no quotes).";
    return res.status(401).json({ error: hint });
  }
}

export function studentAuthMiddleware(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student") {
      return res.status(403).json({ error: "Student access required" });
    }
    req.student = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session. Please login again." });
  }
}
