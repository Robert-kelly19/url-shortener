import {query} from '../config/db.js';

export const handleRedirect = async (req, res, next) => {
  const { shortCode } = req.params;
  try {
    const result = await query('SELECT * FROM url WHERE short_code = $1', [shortCode]);
    if (!result.rows.length) return res.status(404).json({ error: 'Short URL not found' });

    const url = result.rows[0];
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Short URL has expired' });
    }

    await query('UPDATE url SET clicks = clicks + 1 WHERE short_code = $1', [shortCode]);
    res.redirect(302, url.long_url);
  } catch (err) {
    next(err);
  }
};