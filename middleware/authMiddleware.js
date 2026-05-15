import jwt from "jsonwebtoken";

function getToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
}

export function authMiddleware(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session. Please login again." });
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
