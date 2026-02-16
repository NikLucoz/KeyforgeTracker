import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ApiKeyProvider } from '@/hooks/api-key-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApiKeyProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="deck" options={{ presentation: 'card', title: 'Deck Details',  headerLargeTitle: true }} />
          <Stack.Screen name="match" options={{ presentation: 'card', title: 'Match Details' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ApiKeyProvider>
  );
}
