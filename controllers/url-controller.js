import { nanoid } from "nanoid";
import { query } from "../config/db.js";

export const shortenUrl = async (req, res, next) => {
  const { longUrl, customCode, expiresAt } = req.body;
  const userId = req.user.id;

  const code = customCode || nanoid(6);

  try {
    
    const exists = await query(
      "SELECT 1 FROM url WHERE short_code = $1",
      [code]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Custom code already exists" });
    }

    
    const result = await query(
      `
        INSERT INTO url 
          (owner_id, short_code, long_url, expires_at, created_at, clicks) 
        VALUES 
          ($1, $2, $3, $4, NOW(), 0) 
        RETURNING short_code
      `,
      [userId, code, longUrl, expiresAt || null]
    );

    const shortCode = result.rows[0].short_code;

    res.status(201).json({
      shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/redirect/${shortCode}`,
    });
  } catch (err) {
    next(err);
  }
};


export const getMyUrls = async (req, res, next) => {
    const userId = req.user.id;
  try {
    const result = await query(
      `
      SELECT short_code, long_url, created_at, expires_at, clicks 
      FROM url 
      WHERE owner_id = $1 
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
