import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) {
        res.sendStatus(401);
    } 

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                res.sendStatus(403);
            } 
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
    } catch (error) {
        errorHandler(error);
    }
    
}