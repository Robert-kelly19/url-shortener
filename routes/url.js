import express from "express";
import authMiddleware from "../middlewares/Authmid.js";
import { getMyUrls, shortenUrl } from "../controllers/url-controller.js";
import { validateShortenRequest } from "../validator/auth-url-validation.js";

const router = express.Router()
/**
 * @swagger
 * 
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             longUrl:
 *               type: string
 *               example: "https://example.com/some/long/url"
 *             customCode:
 *               type: string
 *               example: "shortCode"
 *             expiresAt:
 *               type: string
 *               format: date-time
 *               example: "2025-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *         schema:
 *           type: object
 *           properties:
 *             shortCode:
 *               type: string
 *               example: "shortCode"
 *             shortUrl:
 *               type: string
 *               example: "http://localhost:3000/s/shortCode"
*/

router.post('/shorten', authMiddleware,validateShortenRequest, shortenUrl)

/**
 * @swagger
 * 
 *  /my-urls:
 *   get:
 *     summary: Get user URLs
 *     responses:
 *       200:
 *         description: List of URLs
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               short_code:
 *                 type: string
 *                 example: "shortCode"
 *               long_url:
 *                 type: string
 *                 example: "https://example.com/some/long/url"
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-05-10T12:00:00Z"
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *               clicks:
 *                 type: integer
 *                 example: 10
 */
router.get('/my-urls', authMiddleware, getMyUrls)

export default router