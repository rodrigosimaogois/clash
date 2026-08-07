import { ClashService } from '../services/clash.service.js';
import { formatLastSeen } from '../utils/time.utils.js';

export const WarController = {
  getWarDetails: async (req, res) => {
    try {
      const clanTag = req.query.tag || req.query.clan || req.query.tag_id;

      if (!clanTag) {
        return res.status(400).json({
          error: 'O parâmetro "tag" é obrigatório. Exemplo: /api/war?tag=20RGVR8',
        });
      }

      // Executa as chamadas em paralelo para otimizar o tempo de resposta
      const [currentRiverRace, currentMembers] = await Promise.all([
        ClashService.getCurrentRiverRace(clanTag),
        ClashService.getClanMembers(clanTag),
      ]);

      const isColosseum = currentRiverRace.periodType === 'colosseum';
      const periodIndex = currentRiverRace.periodIndex || 0;
      const weekDay = periodIndex % 7;

      // 1. CÁLCULO DE PONTOS E DEFESAS DO BARCO (boatInfo)
      const boatPrize = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];
      const boatInfo = {};

      if (currentRiverRace.periodType === 'warDay' && currentRiverRace.periodLogs) {
        const periods = currentRiverRace.periodLogs.slice(-1);
        for (const period of periods) {
          for (const item of period.items || []) {
            const tag = item.clan.tag;
            let defenses = item.numOfDefensesRemaining || 0;
            let totalBoatPoints = 0;

            for (let i = 0; i < defenses; i++) {
              totalBoatPoints += boatPrize[i] || 0;
            }

            if (weekDay === 3) {
              defenses = 15;
              totalBoatPoints = 435;
            }

            boatInfo[tag] = {
              Defenses: defenses,
              BoatPoints: totalBoatPoints,
            };
          }
        }
      }

      // 2. CÁLCULO DE JOGADORES QUE FALTAM ATACAR HOJE (whoIsMissing)
      const participants = currentRiverRace.clan?.participants || [];
      const memberItems = currentMembers.items || [];

      let totalUsedDecks = 0;
      let totalParticipants = 0;

      participants.forEach((p) => {
        const decksUsedToday = p.decksUsedToday || 0;
        totalUsedDecks += decksUsedToday;
        if (decksUsedToday > 0) totalParticipants++;
      });

      const totalMissingParticipants = 50 - totalParticipants;
      const decksMissingParticipants = totalMissingParticipants * 4;
      const totalMissingDecks = 200 - decksMissingParticipants - totalUsedDecks;

      const missingPlayers = [];

      participants.forEach((participant) => {
        const decksUsedToday = participant.decksUsedToday || 0;

        if (decksUsedToday === 4) return; // Jogador já fez os 4 ataques do dia

        const foundInMembers = memberItems.find((m) => m.tag === participant.tag);

        if (foundInMembers) {
          const { strMessage, totalSeconds } = formatLastSeen(foundInMembers.lastSeen);
          missingPlayers.push({
            name: participant.name,
            missingDecks: 4 - decksUsedToday,
            lastSeen: strMessage,
            inClan: true,
            totalSeconds,
          });
        } else if (decksUsedToday > 0) {
          missingPlayers.push({
            name: participant.name,
            missingDecks: 4 - decksUsedToday,
            lastSeen: {},
            inClan: false,
            totalSeconds: 864000,
          });
        }
      });

      // Ordena por decks faltantes e tempo de ausência
      missingPlayers.sort((a, b) => {
        if (a.missingDecks !== b.missingDecks) {
          return a.missingDecks - b.missingDecks;
        }
        return a.totalSeconds - b.totalSeconds;
      });

      // 3. CÁLCULO DE ATAQUES PERDIDOS ACUMULADOS NA SEMANA (getWhoMissed)
      let expectedAttacks = 4 * (weekDay - 3);
      if (expectedAttacks < 0) expectedAttacks = 0;

      if (currentRiverRace.clan?.fame > 10000 && !isColosseum) {
        expectedAttacks = 12;
      }

      const missedWeeklyPlayers = [];

      if (expectedAttacks > 0) {
        participants.forEach((participant) => {
          const usedDecks = participant.decksUsed || 0;
          const usedDecksToday = participant.decksUsedToday || 0;
          const totalDecksInWarDays = usedDecks - usedDecksToday;

          if (totalDecksInWarDays < expectedAttacks) {
            const isCurrentMember = memberItems.some((m) => m.tag === participant.tag);
            if (isCurrentMember) {
              missedWeeklyPlayers.push({
                Name: participant.name,
                Missing: expectedAttacks - totalDecksInWarDays,
              });
            }
          }
        });
      }

      // RETORNO FINAL DA API
      return res.json({
        inWar: true,
        warInfo: {
          clanName: currentRiverRace.clan?.name,
          colosseum: isColosseum,
          boatInfo,
          clans: currentRiverRace.clans || [],
        },
        missingInfo: {
          clanName: currentRiverRace.clan?.name,
          totalDecks: totalUsedDecks,
          totalMissing: totalMissingDecks,
          totalMissingParticipants,
          missingPlayers,
        },
        missed: {
          clanName: currentRiverRace.clan?.name,
          expectedAttacks,
          players: missedWeeklyPlayers,
        },
      });
    } catch (error) {
      console.error('Erro na requisição da guerra:', error.message);

      // Tratamento para clãs fora da guerra ou TAG inexistente
      if (error.message.includes('404')) {
        return res.status(200).json({
          inWar: false,
          message: 'Este clã não está participando da Guerra de Rio atual ou a TAG é inválida.',
        });
      }

      return res.status(500).json({
        error: 'Erro interno ao processar dados da guerra.',
        details: error.message,
      });
    }
  },
};