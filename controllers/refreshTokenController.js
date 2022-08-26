import jwt from 'jsonwebtoken';
import { errorHandler } from '../middleware/errorHandler.js';
import { User } from '../model/User.js';

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    
    if(!cookies?.jwt) {
       return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const isAuthorisedUser = await User.findOne({ refreshToken }).exec();

    if(!isAuthorisedUser)  {
       return res.sendStatus(401);
    }

    try {
        
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded)=>{
                if(err || isAuthorisedUser.username !== decoded.username) return res.sendStatus(403);
                const roles = Object.values(isAuthorisedUser.roles);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            'username': decoded.username,
                            "roles": roles 
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m'}
                );
                res.json({ accessToken });
            }
        )
    } catch (error) {
        errorHandler(error);
    }
}
