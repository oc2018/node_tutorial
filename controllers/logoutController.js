import { User } from '../model/User.js'

export const handleLogout = async(req, res) => {
    // on the client, also delete the access token

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    const isExistingUser = await User.findOne({ refreshToken }).exec();

    if (!isExistingUser) {
        res.clearCookie('jwt', { httpOnly: true, setSite: 'None', secure: true });
        return res.sendStatus(204)
    } 

    // delete the refresh token from the db

    isExistingUser.refreshToken = '';
    const result = await isExistingUser.save();

    res.clearCookie('jwt', { httpOnly: true, setSite: 'None', secure: true });
    res.status(204).json({'message': `User: ${result.username} logged out`});

}