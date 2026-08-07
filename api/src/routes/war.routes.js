import { Router } from 'express';
import { WarController } from '../controllers/war.controller.js';

const router = Router();

router.get('/war', WarController.getWarDetails);

export default router;