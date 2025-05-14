import { loginValidator, validate } from "../validator/user-validator.js";
import resgisterHandler from "../controllers/user-registerController.js";
import express from "express"
import loginHandler from "../controllers/login-controller.js";

const router= express.Router()
/**
 * @swagger
 *  title: url-shortener
 *  version: 1.0.0
 *  description: API url shortener for shortening of urls for a registered user.
**/
/**
 * 
 * @swagger
 * 
 * /auth/register:
 *  post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *  responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 clientId:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *       '409':
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already in use"
 */

router.post("/register",validate,resgisterHandler)

/**
 * @swagger
 *   /auth/login:
 *   post:
 *     summary: user login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login Successful"
 *                 token:
 *                   type: string
 *                   example: "jwt.token.here"
 *                 client:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Credentials"
 */


router.post("/login",loginValidator,loginHandler)

export default router