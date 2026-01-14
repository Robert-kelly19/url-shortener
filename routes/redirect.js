import express from "express";
import {handleRedirect} from '../controllers/redirectController.js'

const router = express.Router()

/**
 * @swagger
 * 
 * /{shortCode}:
 *   get:
 *     summary: Redirect to the original URL
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: Short URL not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Short URL not found"
 *       410:
 *         description: Short URL has expired
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Short URL has expired"
 */


router.get('/:shortCode', handleRedirect);

export default router