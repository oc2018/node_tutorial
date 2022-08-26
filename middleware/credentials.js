import { allowedOrigins } from "../config/allowedOrigins.js";

export const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)){
        res.header('Access-Controal-Allow-Credentials', true);
    }
    next();
}