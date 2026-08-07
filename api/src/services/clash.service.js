const CLASH_API_BASE = 'https://api.clashroyale.com/v1';

export const ClashService = {
  getClanByName: async (clanName) => {
    const token = process.env.CLASH_API_TOKEN;

    if (!token) {
      throw new Error('CLASH_API_TOKEN não está definido no arquivo .env');
    }

    const url = `${CLASH_API_BASE}/clans?name=${encodeURIComponent(clanName)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Clash Royale: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Imprime o erro detalhado no console do terminal
      console.error('--- DETALHES DO ERRO FETCH ---');
      console.error('Mensagem:', error.message);
      console.error('Causa raiz:', error.cause); 
      console.error('-----------------------------');
      throw error;
    }
  }
};