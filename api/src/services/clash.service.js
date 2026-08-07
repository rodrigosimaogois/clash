const CLASH_API_BASE = 'https://api.clashroyale.com/v1';

// Formata e garante a codificação correta da TAG (# -> %23)
const formatTag = (tag) => {
  if (!tag) return '';
  const cleanTag = decodeURIComponent(tag).replace('#', '').trim().toUpperCase();
  return `%23${cleanTag}`;
};

export const ClashService = {
  callEndpoint: async (endpoint) => {
    const token = process.env.CLASH_API_TOKEN;
    if (!token) {
      throw new Error('CLASH_API_TOKEN não está definido no arquivo .env');
    }

    const response = await fetch(`${CLASH_API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Clash Royale: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  },

  getCurrentRiverRace: async (tag) => {
    const formattedTag = formatTag(tag);
    return await ClashService.callEndpoint(`/clans/${formattedTag}/currentriverrace`);
  },

  getClanMembers: async (tag) => {
    const formattedTag = formatTag(tag);
    return await ClashService.callEndpoint(`/clans/${formattedTag}/members`);
  },
};