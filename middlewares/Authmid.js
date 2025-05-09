import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const authMddleware =(req, res, next) => {
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.spli('')[1]: null;

    if(!token){
        logger.warn(`Auth middleweare: no token provider`)
        return res.status(401).json({message:"no token, Authorization has been denied"})
    }

    try {
        const decoded = jwt.verify(process.env.JTW.SECRET)
        req.user = decoded.user
        logger.debug(`Auth middleweare: token varified for user ID ${req.user.id}`)
        next()
    } catch (error) {
        logger.error(`Auth middleweare: token verification failed`, err)
        if(err.name === "TokenExpireError"){
            return res.status(401).json({message: "your token has expired"})
        }

        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({message: "your token is invalid"})
        }
        return res.status(error.status || 501).json({message: error.message || "server error while verifing token"})
    }
}

export default authMddleware