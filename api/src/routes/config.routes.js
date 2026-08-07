import { Router } from 'express';
import { ConfigController } from '../controllers/config.controller.js';

const configRouter = Router();

configRouter.get('/config/status', ConfigController.getStatus);
configRouter.post('/config/token', ConfigController.updateToken);

export default configRouter;