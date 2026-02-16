import { DecksApiResponse } from "../types/deck-types";

export class ApiService {
  private static readonly BASE_URL =
    "https://decksofkeyforge.com/public-api/v1";

  private static readonly API_KEY_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  static async fetchMyDecks(apiKey: string): Promise<DecksApiResponse> {
    if (!this.isValidApiKey(apiKey)) {
      throw new Error("Invalid API key format");
    }

    try {
      const response = await fetch(`${this.BASE_URL}/my-decks`, {
        method: "GET",
        headers: {
          "Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching my decks:", error);
      throw error;
    }
  }

  private static isValidApiKey(apiKey: string): boolean {
    return this.API_KEY_REGEX.test(apiKey);
  }
}
