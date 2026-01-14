import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";

const HASH_SALT = 10;

export default async function registerHandler(req, res, next) {
  const { email, password } = req.body;

  try {
    const checkUserQuery = `SELECT email FROM users WHERE email = $1`;
    const userResult = await query(checkUserQuery, [email]);

    if (userResult.rows.length > 0) {
      logger.warn(`Registration failed: ${email} already exists`);
      return res.status(401).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, HASH_SALT);
    logger.debug(`Password hashed for ${email}`);

    const insertUserQuery = `
      INSERT INTO users(email, password)
      VALUES($1, $2) RETURNING id, email;
    `;

    const newUserResult = await query(insertUserQuery, [email, passwordHash]);

    const newUser = newUserResult.rows[0];
    logger.info(`Successfully registered user: ${newUser.id}`);

    return res.status(201).json({
      message: "User successfully registered",
    });
  } catch (error) {
    logger.error(`Error registering user with email ${email}`, error);
    next(error);
  }
}
