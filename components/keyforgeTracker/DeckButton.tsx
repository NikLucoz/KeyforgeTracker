import { DeckResponse } from '@/types/deck-types';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface DeckProps {
    deckResponse: DeckResponse;
}

export default function DeckComponent({ deckResponse }: DeckProps) {
    return (
        <View>
            <TouchableOpacity
                style={{
                    backgroundColor: '#DB8925',
                    minHeight: 100,
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
                onPress={() => router.push({ pathname: '/deck', params: { deckResponse: JSON.stringify(deckResponse) } })}
            >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                    {deckResponse.deck.name}
                </Text>
                <Text style={{ color: '#fff', fontSize: 14 }}>
                    SAS: {deckResponse.deck.sasRating}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
