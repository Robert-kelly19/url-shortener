import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const HASH_SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export default async function registerHandler(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

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
      INSERT INTO users(first_name, last_name, email, password)
      VALUES($1, $2, $3, $4) RETURNING id, email;
    `;

    const newUserResult = await query(insertUserQuery, [
      firstName,
      lastName,
      email,
      passwordHash,
    ]);

    const newUser = newUserResult.rows[0];

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(`Successfully registered user: ${newUser.id}`);

    return res.status(201).json({
      message: "User successfully registered",
      token,
    });
  } catch (error) {
    logger.error(`Error registering user with email ${email}`, error);
    next(error);
  }
}
