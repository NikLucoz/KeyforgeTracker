import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const API_KEY_KEY = "api_key";

export const useApiKey = () => {
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

    return { apiKey, setApiKey };
};
