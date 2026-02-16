export interface Card {
  cardTitle: string;
  cardTitleUrl: string;
  rarity: string;
  legacy: boolean;
  maverick: boolean;
  anomaly: boolean;
  enhanced: boolean;
  bonusAember: number;
  bonusCapture: number;
  bonusDamage: number;
  bonusDraw: number;
  bonusDiscard: number;
  bonusHouses: string[];
}

export interface HouseAndCards {
  house: string;
  cards: Card[];
}

export interface SynergyDetail {
  house: string;
  cardName: string;
  synergies: any[]; // Adjust if more specific structure is known
  netSynergy: number;
  aercScore: number;
  expectedAmber: number;
  amberControl: number;
  creatureControl: number;
  artifactControl: number;
  efficiency: number;
  recursion: number;
  effectivePower: number;
  creatureProtection: number;
  disruption: number;
  other: number;
  copies: number;
  notCard: string | null;
  synStart: number | null;
}

export interface Deck {
  deckType: string;
  id: number;
  keyforgeId: string;
  expansion: string;
  name: string;
  creatureCount: number;
  actionCount: number;
  artifactCount: number;
  upgradeCount: number;
  expectedAmber: number;
  amberControl: number;
  creatureControl: number;
  artifactControl: number;
  efficiency: number;
  recursion: number;
  effectivePower: number;
  creatureProtection: number;
  disruption: number;
  other: number;
  aercScore: number;
  previousSasRating: number;
  previousMajorSasRating: number;
  aercVersion: number;
  sasRating: number;
  synergyRating: number;
  antisynergyRating: number;
  efficiencyBonus: number;
  totalPower: number;
  rawAmber: number;
  totalArmor: number;
  lastSasUpdate: string;
  sasPercentile: number;
  housesAndCards: HouseAndCards[];
  synergyDetails: SynergyDetail[];
  dateAdded: string;
}

export interface DeckResponse {
  deck: Deck;
  wishlist: boolean;
  funny: boolean;
  notes: string | null;
  ownedByMe: boolean;
}

export type DecksApiResponse = DeckResponse[];
