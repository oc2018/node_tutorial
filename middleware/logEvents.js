import { format } from 'date-fns';
import {v4 as uuid } from 'uuid';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fsPromises from 'fs/promises';
import * as path from 'path';
import { errorHandler } from './errorHandler.js';

export const logEvents = async (message, fileName) => {

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '../', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '../', 'logs', fileName), logItem)        
    } catch (error) {
        errorHandler(error)
    }
}

export const logger = (req, res, next)=> {
    logEvents( `${req.method}\t${req.headers.origin}\t${req.url}\t${res.statusCode}`, 'reqLog.txt' )
    next();
}

export default logEvents;