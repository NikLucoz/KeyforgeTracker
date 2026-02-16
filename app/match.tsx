import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';


type Match = {
    wins: number;
    losses: number;
    opponentId: string;
    opponentName: string;
};

export default function MatchScreen() {
    const { deckId, matchIndex, isNew } = useLocalSearchParams();
    const router = useRouter();
    const [match, setMatch] = useState<Match>({ wins: 0, losses: 0, opponentId: '', opponentName: '' });
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const saved = await AsyncStorage.getItem(`matches_${deckId}`);
                if (saved) {
                    const allMatches = JSON.parse(saved);
                    setMatches(allMatches);
                    if (matchIndex !== undefined && !isNew) {
                        const idx = parseInt(matchIndex as string);
                        if (allMatches[idx]) {
                            setMatch(allMatches[idx]);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading matches:', error);
            }
        };
        loadMatches();
    }, [deckId, matchIndex, isNew]);

    const saveMatch = async () => {
        const newMatches = [...matches];
        if (isNew) {
            newMatches.push(match);
        } else {
            const idx = parseInt(matchIndex as string);
            newMatches[idx] = match;
        }
        setMatches(newMatches);
        try {
            await AsyncStorage.setItem(`matches_${deckId}`, JSON.stringify(newMatches));
            router.back();
        } catch (error) {
            console.error('Error saving match:', error);
        }
    };

    const deleteMatch = async () => {
        Alert.alert(
            'Delete Match',
            'Are you sure you want to delete this match?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const newMatches = matches.filter((_, i) => i !== parseInt(matchIndex as string));
                        setMatches(newMatches);
                        try {
                            await AsyncStorage.setItem(`matches_${deckId}`, JSON.stringify(newMatches));
                            router.back();
                        } catch (error) {
                            console.error('Error deleting match:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isNew ? 'New Match' : 'Edit Match'}</Text>

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

            <Text style={styles.label}>Opponent Deck Name:</Text>
            <TextInput
                style={styles.input}
                value={match.opponentName}
                onChangeText={(text) => setMatch({ ...match, opponentName: text })}
                placeholder="Enter opponent deck name"
            />

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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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