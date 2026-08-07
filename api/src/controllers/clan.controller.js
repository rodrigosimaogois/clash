// src/controllers/clan.controller.js

// 1. IMPORTANTE: Adicione esta linha no topo (com a extensão .js no final)
import { ClashService } from '../services/clash.service.js';

export const getClanInfo = async (req, res) => {
  try {
    const clanName = req.query.clanName || 'UZPUTOZ';
    
    // Chama o serviço importado
    const rawData = await ClashService.getClanByName(clanName);

    res.json(rawData);
  } catch (error) {
    console.error('Erro no controller:', error.message);
    res.status(500).json({ error: error.message });
  }
};