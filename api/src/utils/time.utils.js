export function formatLastSeen(lastSeenStr) {
  if (!lastSeenStr) return { strMessage: 'desconhecido', totalSeconds: 864000 };

  try {
    // Converte o formato da API (20260807T205000.000Z) para ISO 8601
    const formattedIso = lastSeenStr.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.(\d{3})Z$/,
      '$1-$2-$3T$4:$5:$6.$7Z'
    );

    const lastSeenDate = new Date(formattedIso);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);

    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return { strMessage: 'há menos de 1min', totalSeconds: 0 };
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let strMessage = '';
    if (days > 0) {
      strMessage = `há ${days} dia(s), ${hours}h e ${minutes}min`;
    } else if (hours > 0) {
      strMessage = `há ${hours}h e ${minutes}min`;
    } else if (minutes > 0) {
      strMessage = `há ${minutes}min`;
    } else {
      strMessage = 'há menos de 1min';
    }

    return { strMessage, totalSeconds };
  } catch (error) {
    return { strMessage: 'erro ao calcular', totalSeconds: 864000 };
  }
}