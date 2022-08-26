import express from 'express';
import { handleLogin } from '../../controllers/authContoller.js';

const router = express.Router()

router.post('/', handleLogin)

export default router;