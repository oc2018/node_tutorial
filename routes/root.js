import express from 'express';
const router = express.Router()
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, `..`, `views`, `index.html`));
});

export default router;