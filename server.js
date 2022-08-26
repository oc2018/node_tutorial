import express from 'express';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath }from 'url';
import { logger } from './middleware/logEvents.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import rootRoutes from './routes/root.js';
import employeesRoutes from './routes/api/employees.js';
import { corsOptions } from './config/corsOptions.js';
import userRoutes from './routes/api/register.js';
import authRoutes from './routes/api/auth.js';
import refreshRoute from './routes/api/refresh.js';
import logoutRoute from './routes/api/logout.js';
import { verifyJWT } from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import { credentials } from './middleware/credentials.js';
import {} from 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/dbCon.js';


connectDB()

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 3500;

//custom middleware
app.use(logger);

//handle options credentials check before CORS
// and fetch cookies credentials requirement
app.use(credentials);

//third party middleware
app.use(cors(corsOptions));

//middleware for cookies
app.use(cookieParser());

app.use('/', express.urlencoded({ extended: false }), express.json(), express.static( path.join(__dirname, '/public') ));

app.use('/', rootRoutes);
app.use('/register', userRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshRoute);
app.use('/logout', logoutRoute);
app.use(verifyJWT);
app.use('/employees', employeesRoutes)

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,`views`,`404.html`));
    }else if(req.accepts('json')){
        res.json({ error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Nott Found');
    }
});

app.use(errorHandler)

mongoose.connection.once('open', ()=> {
    app.listen(PORT, () => console.log(`Connected to the Database, Server running on port: ${PORT}`));
})

