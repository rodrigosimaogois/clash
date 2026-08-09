const CLASH_API_BASE = 'https://api.clashroyale.com/v1';

const formatTag = (tag) => {
  if (!tag) return '';
  const cleanTag = decodeURIComponent(tag).replace('#', '').trim().toUpperCase();
  return `%23${cleanTag}`;
};

export const ClashService = {
  callEndpoint: async (endpoint) => {
    const token = process.env.CLASH_API_TOKEN;
    if (!token) {
      throw new Error('CLASH_API_TOKEN not defined in environment variables.');
    }

    const response = await fetch(`${CLASH_API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.reason || response.statusText;
      throw new Error(`Clash Royale API error: ${response.status} ${errorMessage}`);
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