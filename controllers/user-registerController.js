import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs"

const HASH_SALT= 10

export default async function resgisterHandler(req,res,next) {
    const {firstName, lastName,email,password} = req.body
    try {
        const checkuser = `SELECT email FROM users WHERE email = $1`;
        const userResult = await query(checkuser,[email])

        if(userResult.rows.length>0){
            logger.warn(`Registration failed: ${email} already exist`)
            return res.status(401).json({message:"email already in use"})
        }

        const passwordHash = await bcrypt.hash(password, HASH_SALT)
        logger.debug(`password has been hash for ${email}`)

        const insertUser = `INSERT INTO users(first_name,last_name,email,password)
                            VALUES($1,$2,$3,$4) RETURNING id;`
        const newUserResult = await query(insertUser,[firstName,lastName,email,passwordHash])
        const newuser = newUserResult.rows[0]
        logger.info(`successfully registered user: ${newuser.id}`)

        return res.status(201).json({
            message: "new user successfully registered",
            userid: {
                id:newuser.id
            }
        })
    } catch (error) {
      logger.error(`error registering user  with email ${email}`, error)
      next(error) 
    }
}