import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'expo-image';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import DeckComponent from '../../components/keyforgeTracker/DeckButton';
import { useApiKey } from '../../hooks/use-api-key';
import { useCachedDecks } from '../../hooks/use-cached-decks';

export default function MyDecksScreen() {
  const colorScheme = useColorScheme();
  const { apiKey } = useApiKey();
  const { decks, loading, error, fetchDecks } = useCachedDecks(apiKey);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A62326', dark: '#A62326' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/KeyforgeLogo.png')}
            style={styles.logo}
          />
        </View>
      }>
      
      {/* Your screen content goes here */}
      <View style={styles.mydecksheader}>
        <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>My decks:</Text>
      </View>
      {!apiKey ? (
        <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>
          Set the API key in the settings to view your decks.
        </Text>
      ) : (
        <>
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          {!loading && !error && decks.length === 0 && (
            <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>
              No decks found.
            </Text>
          )}
          {decks.length > 0 && (
            <View style={{ marginTop: 20, gap: 15 }}>
              {decks.sort((a, b) => b.deck.sasRating - a.deck.sasRating).map((deckResponse, index) => (
                <DeckComponent key={index} deckResponse={deckResponse} />
              ))}
            </View>
          )}

        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  mydecksheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 200,
    width: 300,
    resizeMode: 'contain',
  },
});
