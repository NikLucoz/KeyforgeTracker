import * as React from 'react';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors } from '../../constants/theme';


export default function MatchScreen() {
  const [amberCount, setAmberCount] = useState(0);
  const [chains, setChains] = useState(0);
  const [keysForged, setKeysForged] = useState({
    blue: false,
    red: false,
    yellow: false,
  });

  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 40,
    },
    innerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: textColor,
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    counterContainer: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20,
      position: 'relative',
    },
    image: {
      width: 60,
      height: 60,
      position: 'absolute',
    },
    counter: {
      fontSize: 20,
      fontWeight: 'bold',
      color: textColor,
      zIndex: 1,
    },
    counter2: {
      fontSize: 20,
      fontWeight: 'bold',
      zIndex: 1,
    },
    button: {
      backgroundColor: '#DB8925',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 999,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: "#fff",
    },
  });


  const getCardsToDraw = (chains: number) => {
    if (chains >= 1 && chains <= 6) return 1;
    if (chains >= 7 && chains <= 12) return 2;
    if (chains >= 13 && chains <= 18) return 3;
    if (chains >= 19 && chains <= 24) return 4;
    return 0;
  };

  const toggleKey = (color: string) => {
    setKeysForged((prev) => ({
      ...prev,
      [color as keyof typeof keysForged]: !prev[color as keyof typeof keysForged],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Æmber Pool</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => amberCount-6 >= 0 ? setAmberCount(amberCount - 6) : ""}
          >
            <Text style={styles.buttonText}>-6</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => amberCount-1 >= 0 ? setAmberCount(amberCount - 1) : ""}
          >
            <Text style={styles.buttonText}>-1</Text>
          </TouchableOpacity>

          <View style={styles.counterContainer}>
            <Image
              source={require('@/assets/images/game/amber.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.counter2}>{amberCount}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setAmberCount(amberCount + 1)}
          >
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setAmberCount(amberCount + 2)}
          >
            <Text style={styles.buttonText}>+2</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Keys</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Blue Key */}
          <TouchableOpacity onPress={() => toggleKey('blue')}>
            <Image
              source={
                keysForged.blue
                  ? require('@/assets/images/game/forgedkeyblue.png')
                  : require('@/assets/images/game/unforgedkeyblue.png')
              }
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>

          {/* Red Key */}
          <TouchableOpacity onPress={() => toggleKey('red')}>
            <Image
              source={
                keysForged.red
                  ? require('@/assets/images/game/forgedkeyred.png')
                  : require('@/assets/images/game/unforgedkeyred.png')
              }
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>

          {/* Yellow Key */}
          <TouchableOpacity onPress={() => toggleKey('yellow')}>
            <Image
              source={
                keysForged.yellow
                  ? require('@/assets/images/game/forgedkeyyellow.png')
                  : require('@/assets/images/game/unforgedkeyyellow.png')
              }
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.innerContainer}>
        <Text style={styles.title}>Chains</Text>
        <View style={[styles.buttonRow, { marginBottom: 10 }]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => chains - 1 >= 0 ? setChains(chains - 1) : null}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <View style={styles.counterContainer}>
            <Text style={styles.counter}>{chains}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => chains + 1 <= 24 ? setChains(chains + 1) : null}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/game/chains.png')}
            style={{ width: 80, height: 80, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor }}>
            Draw {getCardsToDraw(chains)} fewer card{getCardsToDraw(chains) === 1 ? '' : 's'}
          </Text>
        </View>
      </View>
    </View>
  );
}
