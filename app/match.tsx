import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Match, MatchService } from '../utils/match-service';

export default function MatchScreen() {
    const { deckId, matchIndex, isNew } = useLocalSearchParams();
    const router = useRouter();
    const [match, setMatch] = useState<Match>({ gameMode: 'standard', wins: 0, losses: 0, opponentId: '', opponentName: '', additionalPlayers: [] });
    const [matches, setMatches] = useState<Match[]>([]);

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(() => {
        const loadMatches = async () => {
            const allMatches = await MatchService.loadMatches(deckId as string);
            setMatches(allMatches);
            if (matchIndex !== undefined && !isNew) {
                const idx = parseInt(matchIndex as string);
                if (allMatches[idx]) {
                    const loadedMatch = allMatches[idx];
                    // Ensure backward compatibility
                    const updatedMatch: Match = {
                        gameMode: loadedMatch.gameMode || 'standard',
                        wins: loadedMatch.wins,
                        losses: loadedMatch.losses,
                        opponentId: loadedMatch.opponentId,
                        opponentName: loadedMatch.opponentName,
                        additionalPlayers: (loadedMatch.additionalPlayers || []).map((p: any) => ({
                            deckName: p.deckName || p.name || '',
                            team: p.team || ('opponent' as const)
                        })),
                    };
                    setMatch(updatedMatch);
                }
            }
        };
        loadMatches();
    }, [deckId, matchIndex, isNew]);

    const saveMatch = async () => {
        if (isNew) {
            await MatchService.addMatch(deckId as string, match);
        } else {
            const idx = parseInt(matchIndex as string);
            await MatchService.updateMatch(deckId as string, idx, match);
        }
        router.back();
    };

    const deleteMatch = async () => {
        const confirmDelete = () => {
            const idx = parseInt(matchIndex as string);
            MatchService.deleteMatch(deckId as string, idx).then(() => {
                router.back();
            }).catch((error) => {
                console.error('Error deleting match:', error);
                if (Platform.OS !== 'web') {
                    Alert.alert('Error', 'Failed to delete match');
                } else {
                    alert('Failed to delete match');
                }
            });
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this match?')) {
                confirmDelete();
            }
        } else {
            Alert.alert(
                'Delete Match',
                'Are you sure you want to delete this match?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: confirmDelete,
                    },
                ]
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isNew ? 'New Match' : 'Edit Match'}</Text>

            <View style={styles.toggleContainer}>
                <Text style={styles.label}>Game Mode:</Text>
                <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Standard</Text>
                    <Switch
                        value={match.gameMode === 'multiplayer'}
                        onValueChange={(value) => setMatch({ ...match, gameMode: value ? 'multiplayer' : 'standard' })}
                    />
                    <Text style={styles.toggleLabel}>Vault Assault / 2vs2</Text>
                </View>
            </View>

            <Text style={styles.label}>Wins:</Text>
            <TextInput
                style={styles.input}
                keyboardType='numeric'
                value={match.wins.toString()}
                onChangeText={(text) => setMatch({ ...match, wins: parseInt(text) || 0 })}
            />

            <Text style={styles.label}>Losses:</Text>
            <TextInput
                style={styles.input}
                keyboardType='numeric'
                value={match.losses.toString()}
                onChangeText={(text) => setMatch({ ...match, losses: parseInt(text) || 0 })}
            />

            {match.gameMode === 'standard' && (
                <>
                    <Text style={styles.label}>Opponent Deck Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={match.opponentName}
                        onChangeText={(text) => setMatch({ ...match, opponentName: text })}
                        placeholder="Enter opponent deck name"
                    />
                </>
            )}

            {match.gameMode === 'multiplayer' && (
                <>
                    <Text style={styles.label}>Players:</Text>
                    {match.additionalPlayers?.map((player, index) => (
                        <View key={index} style={styles.playerContainer}>
                            <View style={styles.playerDetails}>
                                <TextInput
                                    style={[styles.input, styles.playerInput]}
                                    value={player.deckName}
                                    onChangeText={(text) => {
                                        const newPlayers = [...(match.additionalPlayers || [])];
                                        newPlayers[index] = { ...newPlayers[index], deckName: text };
                                        setMatch({ ...match, additionalPlayers: newPlayers });
                                    }}
                                    placeholder={`Deck Name`}
                                />
                            </View>
                            <View style={styles.teamContainer}>
                                <Text style={styles.teamLabel}>Team:</Text>
                                <View style={styles.teamToggle}>
                                    <Text style={styles.teamText}>Mine</Text>
                                    <Switch
                                        value={player.team === 'opponent'}
                                        onValueChange={(value) => {
                                            const newPlayers = [...(match.additionalPlayers || [])];
                                            newPlayers[index] = { ...newPlayers[index], team: value ? 'opponent' : 'mine' };
                                            setMatch({ ...match, additionalPlayers: newPlayers });
                                        }}
                                    />
                                    <Text style={styles.teamText}>Opponent</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deletePlayerButton}
                                    onPress={() => {
                                        const newPlayers = (match.additionalPlayers || []).filter((_, i) => i !== index);
                                        setMatch({ ...match, additionalPlayers: newPlayers });
                                    }}
                                >
                                    <MaterialIcons name="delete" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            const newPlayers = [...(match.additionalPlayers || []), { deckName: '', team: 'opponent' as const }];
                            setMatch({ ...match, additionalPlayers: newPlayers });
                        }}
                    >
                        <Text style={styles.addButtonText}>Add Player</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={saveMatch}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            {!isNew && (
                <TouchableOpacity style={styles.deleteButton} onPress={deleteMatch}>
                    <MaterialIcons name="delete" size={20} color="white" />
                    <Text style={styles.deleteButtonText}>Delete Match</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        color: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    toggleContainer: {
        marginBottom: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleLabel: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    playerContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
    },
    playerDetails: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    playerInput: {
        flex: 1,
        marginHorizontal: 5,
    },
    teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 10,
    },
    teamToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamText: {
        fontSize: 14,
        marginHorizontal: 5,
    },
    deletePlayerButton: {
        marginLeft: 10,
        padding: 5,
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#DB8925',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
    },
});