import { Router } from 'express';
import { getClanInfo } from '../controllers/clan.controller.js';

const router = Router();

// GET http://localhost:3000/api/clans
router.get('/clans', getClanInfo);

export default router;