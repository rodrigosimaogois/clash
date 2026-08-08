export interface ClanInfo {
  Name: string;
  Tag: string;
  BadgeId: number;
  ClanScore: number;
  Total: number;
  Average: string;
  PlayersToday: number;
  DecksToday: number;
  MissingAttacksToday: number;
  MinPoints: number;
  Estimation: number;
  MaxPoints: number;
  Fame: number;
  BoatPoints: number;
  PositionBonus: number;
  FinalPosition: number;
}

export interface MissingPlayer {
  name: string;
  missingDecks: number;
  lastSeen: string;
  inClan: boolean;
}

export interface MissingInfo {
  totalMissingParticipants: number;
  totalMissing: number;
  fullMissingPlayers: number;
  partialMissingPlayers: number;
  partialMissingDecks: number;
  emptySlots: number;
  emptySlotsDecks: number;
  summary: string;
  missingPlayers: MissingPlayer[];
}

export interface MissedPlayer {
  Name: string;
  Missing: number;
}

export interface WarDetailsResponse {
  warInfo: {
    clanName: string;
    colosseum: boolean;
    clansInfos: ClanInfo[];
  };
  missingInfo: MissingInfo;
  missed: {
    players: MissedPlayer[];
  };
}
