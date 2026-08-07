import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes.js';
import configRouter from './routes/config.routes.js';
import warRoutes from './routes/war.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Registra o prefixo /api para as rotas do item
app.use('/api', itemRoutes);
app.use('/api', configRouter);
app.use('/api', warRoutes);

export default app;