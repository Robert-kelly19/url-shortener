import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    logger.warn("Auth middleware: No token provided");
    return res.status(401).json({ message: "No token. Authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    logger.debug(`Auth middleware: Token verified for user ID ${req.user.id}`);
    next();
  } catch (error) {
    logger.error("Auth middleware: Token verification failed", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Your token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Your token is invalid" });
    }

    return res.status(500).json({
      message: error.message || "Server error while verifying token",
    });
  }
};

export default authMiddleware;
