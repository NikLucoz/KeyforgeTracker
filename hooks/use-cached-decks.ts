import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { DecksApiResponse } from "../types/deck-types";
import { ApiService } from "../utils/api-service";

const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 giorni in millisecondi

export const useCachedDecks = (apiKey: string | null) => {
  const [decks, setDecks] = useState<DecksApiResponse>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(`decks_${apiKey}`);
    } catch (error) {
      console.error("Error clearing decks cache:", error);
    }
  };

  const loadFromCache = async (): Promise<DecksApiResponse | null> => {
    try {
      const cached = await AsyncStorage.getItem(`decks_${apiKey}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error("Error loading decks from cache:", error);
    }
    return null;
  };

  const saveToCache = async (data: DecksApiResponse) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`decks_${apiKey}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving decks to cache:", error);
    }
  };

  const fetchDecks = async (force = false) => {
    if (!apiKey || loading) return;
    setLoading(true);
    setError(null);

    if (!force) {
      const cachedData = await loadFromCache();
      if (cachedData) {
        setDecks(cachedData);
        setLoading(false);
        return;
      }
    }

    try {
      const data = await ApiService.fetchMyDecks(apiKey);
      setDecks(data);
      await saveToCache(data);
    } catch (err: any) {
      if (err.message && err.message.includes("429")) {
        setError("Too many requests, try again later.");
      } else {
        setError("Failed to fetch decks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      fetchDecks();
    }
  }, [apiKey]);

  return { decks, loading, error, fetchDecks, clearCache };
};
