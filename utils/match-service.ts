import AsyncStorage from "@react-native-async-storage/async-storage";

export type Match = {
  wins: number;
  losses: number;
  opponentId: string;
  opponentName: string;
};

export class MatchService {
  private static getStorageKey(deckId: string): string {
    return `matches_${deckId}`;
  }

  static async loadMatches(deckId: string): Promise<Match[]> {
    try {
      const saved = await AsyncStorage.getItem(this.getStorageKey(deckId));
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch (error) {
      console.error("Error loading matches:", error);
      return [];
    }
  }

  static async saveMatches(deckId: string, matches: Match[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.getStorageKey(deckId),
        JSON.stringify(matches),
      );
    } catch (error) {
      console.error("Error saving matches:", error);
      throw error;
    }
  }

  static async addMatch(deckId: string, match: Match): Promise<void> {
    const matches = await this.loadMatches(deckId);
    matches.push(match);
    await this.saveMatches(deckId, matches);
  }

  static async updateMatch(
    deckId: string,
    index: number,
    match: Match,
  ): Promise<void> {
    const matches = await this.loadMatches(deckId);
    if (matches[index]) {
      matches[index] = match;
      await this.saveMatches(deckId, matches);
    }
  }

  static async deleteMatch(deckId: string, index: number): Promise<void> {
    const matches = await this.loadMatches(deckId);
    const newMatches = matches.filter((_, i) => i !== index);
    await this.saveMatches(deckId, newMatches);
  }

  static async clearMatchesCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const matchKeys = keys.filter((key) => key.startsWith("matches_"));
      await AsyncStorage.multiRemove(matchKeys);
      console.log("Matches cache cleared");
    } catch (error) {
      console.error("Failed to clear matches cache:", error);
      throw error;
    }
  }
}
