import express from "express";
import authMiddleware from "../middlewares/Authmid.js";
import { getMyUrls, shortenUrl } from "../controllers/url-controller.js";
import { validateShortenRequest } from "../validator/auth-url-validation.js";

const router = express.Router();

router.post("/shorten", authMiddleware, validateShortenRequest, shortenUrl);

router.get("/my-urls", authMiddleware, getMyUrls);

export default router;
