import { write } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import winston from "winston";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const logDir = path.join(__dirname, "logs")

const {colorize, align,errors,json, combine, timestamp} =winston.format

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine (
    timestamp({format: "YYYY-DD-MM  HH:mm:ss"}),
    errors({stack: true}),
    json()
  ),
  transports : [
    new winston.transports.File({
        filename: path.join(logDir, 'app.log'),
        level: "info",
        maxFiles: 5,
        maxsize: 5242880
    }),

    new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: "error",
        maxFiles: 5,
        maxsize: 5242880
    })
  ],
  exceptionHandlers:[
    new winston.transports.File({filename: path.join(logDir, "exception.log")})
  ],
  rejectionHandlers:[
    new winston.transports.File({filename: path.join(logDir, "rejection.log")})
  ],
  exitOnError: false
})

if(process.env.NODE_ENV !=="production"){
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            timestamp({format: "YYYY-DD-MM HH:mm:ss"}),
            align()
        ),
        level: "debug"
    }))
}

logger.stream = {
    write: (message) => {
        logger.info(message.substring(0,message.lastIndexOf('\n')))
    }
}

export default logger