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

    // Get client IP address (considering proxies)
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Try to insert click event (will only insert if this is a new visitor combination)
    const clickResult = await query(
      `INSERT INTO click_events (url_id, ip_address, user_agent)
       VALUES ($1, $2, $3)
       ON CONFLICT (url_id, ip_address, user_agent) DO NOTHING
       RETURNING id`,
      [url.id, ipAddress, userAgent]
    );

    // If a new visitor event was inserted, increment unique_visitors
    if (clickResult.rows.length > 0) {
      await query('UPDATE url SET unique_visitors = unique_visitors + 1 WHERE id = $1', [url.id]);
    }

    // Always increment total clicks
    await query('UPDATE url SET clicks = clicks + 1 WHERE short_code = $1', [shortCode]);

    res.redirect(302, url.long_url);
  } catch (err) {
    next(err);
  }
};