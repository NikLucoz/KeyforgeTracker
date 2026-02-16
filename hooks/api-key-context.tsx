import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const API_KEY_KEY = "api_key";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await AsyncStorage.getItem(API_KEY_KEY);
        setApiKeyState(key);
      } catch (error) {
        console.error("Error loading API key:", error);
      }
    };
    loadApiKey();
  }, []);

  const setApiKey = async (key: string) => {
    try {
      await AsyncStorage.setItem(API_KEY_KEY, key);
      setApiKeyState(key);
    } catch (error) {
      console.error("Error saving API key:", error);
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};