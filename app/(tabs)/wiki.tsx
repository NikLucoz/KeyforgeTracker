import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WikiScreen() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://archonarcana.com/Main_Page' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});