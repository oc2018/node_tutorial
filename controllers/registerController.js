import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../middleware/errorHandler.js';

export const handleNewUser = async(req, res) => {
    const { password, username } = req.body;
        
    try {

    if (!req?.body?.username || !req?.body?.password) {
        errorHandler({ 'message':`username and Password are required` })
        res.status(400).json({ 'message':`username and Password are required` });
    }

    const isExistingUser = await User.findOne({ username });

    if(isExistingUser) {
        errorHandler({ 'message': `User ${ username } already exists` })
        res.status(409).json({ 'message': `User ${ username } already exists` });
    } 

        const hashedPwd = await bcrypt.hash(password, 12);

        const result = await User.create({ password: hashedPwd, username });
        
        res.status(201).json( result );
        
    } catch (error) {
        errorHandler(error);
        res.status(500).json({ 'message': error.message });
    }
}