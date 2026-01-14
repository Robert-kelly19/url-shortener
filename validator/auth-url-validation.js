import Joi from "joi";


const shortenUrlSchema = Joi.object({
    longUrl: Joi.string().uri().required(),
    customCode: Joi.string().alphanum().min(3).max(20).optional(),
    expiresAt: Joi.date().optional()
})

export function validateShortenRequest(req,res, next) {
    const { error } = shortenUrlSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
export default shortenUrlSchema