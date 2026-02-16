import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';
import { useApiKey } from '../../hooks/use-api-key';
import { useCachedDecks } from '../../hooks/use-cached-decks';

export default function Settings() {
  const { apiKey, setApiKey } = useApiKey();
  const { fetchDecks, clearCache } = useCachedDecks(apiKey);
  const [inputKey, setInputKey] = useState(apiKey || '');

  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;

  useEffect(() => {
    setInputKey(apiKey || '');
  }, [apiKey]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      color: textColor,
    },
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    button: {
      backgroundColor: '#DB8925',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: textColor,
      textAlign: 'center',
    },
  });

  const handleSave = () => {
    setApiKey(inputKey);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' }}>
        <Text style={{ color: textColor }}>To set your API key go to </Text>
        <TouchableOpacity onPress={() => {
          // Open the URL in the default browser
          const url = 'https://decksofkeyforge.com/about/sellers-and-devs';
          Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
        }}>
          <Text style={{ color: '#DB8925' }}>Decks Of Keyforge</Text>
        </TouchableOpacity>
        <Text style={{ color: textColor }}> and generate one</Text>
      </View>

      <Text>Api Key:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter API Key"
        value={inputKey}
        onChangeText={setInputKey}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save API Key</Text>
      </TouchableOpacity>

      {apiKey && (
        <View style={{ marginTop: 40, gap: 10 }}>
          <TouchableOpacity style={styles.button} onPress={() => fetchDecks(true)}>
            <Text style={styles.buttonText}>Force Refresh Decks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={clearCache}>
            <Text style={styles.buttonText}>Clear Decks Cache</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

