import { ClashService } from '../services/clash.service.js';
import { formatLastSeen } from '../utils/time.utils.js';

export const WarController = {
  getWarDetails: async (req, res) => {
    try {
      const clanTag = req.query.tag || req.query.clan || req.query.tag_id;

      if (!clanTag) {
        return res.status(400).json({ error: 'The "tag" parameter is required.' });
      }

      const [currentRiverRace, currentMembers] = await Promise.all([
        ClashService.getCurrentRiverRace(clanTag),
        ClashService.getClanMembers(clanTag),
      ]);

      const isColosseum = currentRiverRace.periodType === 'colosseum';
      const periodIndex = currentRiverRace.periodIndex || 0;
      const weekDay = periodIndex % 7;

      const boatPrize = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];
      const positionPoints = [3000, 1800, 1000, 600, 400];

      // -----------------------------------------------------------------
      // clansInfos
      // -----------------------------------------------------------------
      const rawClans = (currentRiverRace.clans || []).map((clan) => {
        const participants = clan.participants || [];

        // Today estimated points
        const decksToday = participants.reduce((acc, p) => acc + (p.decksUsedToday || 0), 0);
        const playersToday = participants.filter((p) => (p.decksUsedToday || 0) > 0).length;
        const missingAttacksToday = Math.max(0, 200 - decksToday);

        // Points calculations
        const fameToday = clan.fameToday || clan.periodPoints || 0;
        const fameTotal = clan.fame || 0;

        // Average points per deck today (to estimate missing attacks)
        const rawAverage = decksToday > 0 ? (fameToday / decksToday) : 0;
        const averageFormatted = rawAverage.toFixed(2);
        const averageNum = parseFloat(averageFormatted);

        // Perspectives
        const minPoints = fameToday + (missingAttacksToday * 100);
        const estimation = fameToday + Math.round(missingAttacksToday * averageNum);
        const maxPoints = fameToday + (missingAttacksToday * 225);

        // Boat points calculation
        let boatPoints = 0;
        if (currentRiverRace.periodType === 'warDay' && currentRiverRace.periodLogs) {
          const lastPeriod = currentRiverRace.periodLogs.slice(-1)[0];
          const clanLog = lastPeriod?.items?.find((item) => item.clan.tag === clan.tag);
          if (clanLog) {
            const defenses = clanLog.numOfDefensesRemaining || 0;
            for (let i = 0; i < defenses; i++) {
              boatPoints += boatPrize[i] || 0;
            }
            if (weekDay === 3) boatPoints = 435;
          }
        }

        return {
          Name: clan.name,
          Tag: clan.tag,
          BadgeId: clan.badgeId,
          ClanScore: clan.clanScore || 0,
          Total: fameToday,
          Average: averageFormatted,
          PlayersToday: playersToday,
          DecksToday: decksToday,
          MissingAttacksToday: missingAttacksToday,
          MinPoints: minPoints,
          Estimation: estimation,
          MaxPoints: maxPoints,
          Fame: fameTotal,
          BoatPoints: boatPoints,
        };
      });

      // Order clans by Total descending
      rawClans.sort((a, b) => b.Total - a.Total);

      // Calculate PositionBonus based on the sorted order
      const clansInfos = rawClans.map((clan, index) => {
        const positionBonus = positionPoints[index] || 0;
        return {
          ...clan,
          PositionBonus: positionBonus,
          FinalPosition: clan.Fame + positionBonus + clan.BoatPoints
        };
      });

      // -----------------------------------------------------------------
      // missingInfo (Current Members + Empty Slots / Departed Players)
      // -----------------------------------------------------------------
      const clanParticipants = currentRiverRace.clan?.participants || [];
      const memberItems = currentMembers.items || [];
      const missingPlayers = [];

      let fullMissingPlayers = 0;
      let partialMissingPlayers = 0;
      let partialMissingDecks = 0;
      let currentMembersMissingDecks = 0;

      // Map participants by tag for fast lookup
      const participantMap = new Map();
      clanParticipants.forEach((p) => participantMap.set(p.tag, p));

      // 1. Process active members in the clan
      memberItems.forEach((member) => {
        const participant = participantMap.get(member.tag);
        const decksUsedToday = participant ? (participant.decksUsedToday || 0) : 0;

        if (decksUsedToday >= 4) return;

        const missingDecks = 4 - decksUsedToday;
        currentMembersMissingDecks += missingDecks;

        if (decksUsedToday === 0) {
          fullMissingPlayers += 1;
        } else {
          partialMissingPlayers += 1;
          partialMissingDecks += missingDecks;
        }

        missingPlayers.push({
          name: member.name,
          missingDecks: missingDecks,
          lastSeen: formatLastSeen(member.lastSeen).strMessage,
          inClan: true,
        });
      });

      // 2. Identify ex-members who played today or empty slots to reach the 200 deck limit (50 players)
      const targetClan = clansInfos.find((c) => c.Tag === currentRiverRace.clan?.tag);
      const targetMissingAttacks = targetClan ? targetClan.MissingAttacksToday : 0;

      // Unaccounted decks (difference between clan total missing and current members missing)
      const emptySlotsDecks = Math.max(0, targetMissingAttacks - currentMembersMissingDecks);
      const emptySlotsCount = Math.ceil(emptySlotsDecks / 4);

      // Total missing matches the clan's global missing decks (e.g. 58)
      const totalMissingDecks = currentMembersMissingDecks + emptySlotsDecks;

      // -----------------------------------------------------------------
      // missed Players (Expected Decks in the past days)
      // -----------------------------------------------------------------
      let expectedAttacks = 4 * (weekDay - 3);
      if (expectedAttacks < 0) expectedAttacks = 0;
      if (currentRiverRace.clan?.fame > 10000 && !isColosseum) expectedAttacks = 12;

      const missedPlayers = [];

      if (expectedAttacks > 0) {
        clanParticipants.forEach((participant) => {
          const usedDecksTotal = participant.decksUsed || 0;
          const usedDecksToday = participant.decksUsedToday || 0;
          const decksInPastDays = usedDecksTotal - usedDecksToday;

          if (decksInPastDays < expectedAttacks) {
            const isCurrentMember = memberItems.some((m) => m.tag === participant.tag);
            if (isCurrentMember) {
              missedPlayers.push({
                Name: participant.name,
                Missing: expectedAttacks - decksInPastDays,
              });
            }
          }
        });
      }

      // -----------------------------------------------------------------
      // Final Response
      // -----------------------------------------------------------------
      return res.json({
        warInfo: {
          clanName: currentRiverRace.clan?.name,
          colosseum: isColosseum,
          clansInfos: clansInfos,
        },
        missingInfo: {
          totalMissingParticipants: missingPlayers.length + emptySlotsCount,
          totalMissing: totalMissingDecks,
          fullMissingPlayers: fullMissingPlayers,
          partialMissingPlayers: partialMissingPlayers,
          partialMissingDecks: partialMissingDecks,
          emptySlots: emptySlotsCount,
          emptySlotsDecks: emptySlotsDecks,
          summary: `${fullMissingPlayers} in-clan with 0 attacks + ${partialMissingPlayers} partial (${partialMissingDecks} decks) + ${emptySlotsCount} empty slots/left members (${emptySlotsDecks} decks)`,
          missingPlayers: missingPlayers,
        },
        missed: {
          players: missedPlayers,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error processing war data', details: error.message });
    }
  },
};