import { validate } from "../validator/user-validator.js";
import resgisterHandler from "../controllers/user-registerController.js";
import express from "express"

const router= express.Router()

router.post("/register",validate,resgisterHandler)

export default router