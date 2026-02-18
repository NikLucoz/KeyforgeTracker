import { DeckResponse } from '@/types/deck-types';
import { House, houseLogos } from '@/utils/houses_logo';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Match, MatchService } from '../utils/match-service';

export default function DeckScreen() {
    const { deckResponse } = useLocalSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const parsedDeckResponse: DeckResponse = JSON.parse(deckResponse as string);

    const { deck } = parsedDeckResponse;

    const [matches, setMatches] = useState<Match[]>([]);

    const loadMatches = async () => {
        const loadedMatches = await MatchService.loadMatches(deck.keyforgeId);
        setMatches(loadedMatches);
    };

    useEffect(() => {
        loadMatches();
    }, [deck.keyforgeId, pathname]);

    const addMatch = () => {
        router.push(`/match?deckId=${deck.keyforgeId}&isNew=true`);
    };

    return (
        <>
            <StatusBar translucent />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{deck.name}</Text>
                <Text style={styles.detail}>SAS Rating: {deck.sasRating}</Text>
                <Text style={styles.detail}>Expansion: {deck.expansion.replaceAll('_', ' ')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.detail}>Houses: </Text>
                    {deck.housesAndCards.map((h, index) => (
                        <Image key={index} source={houseLogos[h.house as House]} style={{ width: 40, height: 40, marginLeft: 5 }} />
                    ))}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        var url = 'https://decksofkeyforge.com/decks/' + deck.keyforgeId;
                        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
                    }}>
                    <   Text style={styles.closeButtonText}>Show on DOK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        var url = 'https://www.keyforgegame.com/deck-details/' + deck.keyforgeId;
                        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
                    }}>
                        <Text style={styles.closeButtonText}>Show on KF</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ ...styles.detail, marginTop: 20, fontWeight: 'bold' }}>Local matches:</Text>
                <TouchableOpacity onPress={addMatch} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Match</Text>
                </TouchableOpacity>
                {matches.length > 0 && (
                    <View style={styles.matchesList}>
                        {matches.map((match, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.matchItem}
                                onPress={() => router.push(`/match?deckId=${deck.keyforgeId}&matchIndex=${index}`)}
                            >
                                <Text style={styles.matchText}>Wins: {match.wins} | Losses: {match.losses}</Text>
                                {match.gameMode === 'standard' && (
                                    <Text style={styles.matchText}>Opponent: {match.opponentName}</Text>
                                )}
                                {match.gameMode === 'multiplayer' && match.additionalPlayers && match.additionalPlayers.length > 0 && (
                                    <>
                                        {(() => {
                                            const myTeam = match.additionalPlayers.filter(p => p.team === 'mine').map(p => p.deckName);
                                            const oppTeam = match.additionalPlayers.filter(p => p.team === 'opponent').map(p => p.deckName);
                                            return (
                                                <>
                                                    {myTeam.length > 0 && <Text style={styles.matchText}>My Team: {myTeam.join(', ')}</Text>}
                                                    {oppTeam.length > 0 && <Text style={styles.matchText}>Opponent Team: {oppTeam.join(', ')}</Text>}
                                                </>
                                            );
                                        })()}
                                    </>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detail: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#DB8925',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#DB8925',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    matchesList: {
        marginTop: 10,
    },
    matchItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    matchText: {
        fontSize: 14,
        marginBottom: 2,
    },
});