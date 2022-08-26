import bcrypt from 'bcryptjs';
import { User } from '../model/User.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../middleware/errorHandler.js';

export const handleLogin = async(req, res) => {
    const { username, password } = req.body;

    try {      
   
    if(!req?.body?.username || !req?.body?.password ) {
        res.status(400).json({'message': `User and password are required`});
    } 
    
    const isExistingUser = await User.findOne({ username }).exec();
    
    if(!isExistingUser) {
        res.status(401).json({'message': `Unauthorized: Need to sign up`});
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, isExistingUser.password);

    if(isPasswordCorrect) {
        const roles = Object.values(isExistingUser.roles);

        const accessToken = jwt.sign(
            { 
                'UserInfo':{
                    'username': isExistingUser.username,
                    'roles': roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            {'username': isExistingUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        
        isExistingUser.refreshToken = refreshToken ;
        await isExistingUser.save();
                
        res.cookie('jwt', refreshToken, { httpOnly: true, setSite: 'None', secure: true, maxAge: 24 * 60 * 60 *1000 }); //secure: true
        res.status(200).json( accessToken );
    } else {
        res.status(401).json({'message': `Unauthorized: Log in failled`});
    }
} catch (error) {
    errorHandler(error);
}
}