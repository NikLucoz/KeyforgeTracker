# KeyforgeTracker
A React Native app built with Expo to track your Keyforge decks and local matches. Keep track of your game history, deck details, and opponent information all in one place!

<p align="center">
  <img src="https://github.com/user-attachments/assets/022e392f-49a7-4ab9-8773-87cedcd87e0d" width="200"/>
  <img src="https://github.com/user-attachments/assets/bc70d6ea-7179-47cf-842a-fb08e6fa54de" width="200"/>
</p>

## Features
- **Deck Management**: Load and display your decks from the Decks of Keyforge API, including SAS ratings, expansions, and house icons.
- **Match Tracking**: Add, edit, and delete local matches for each deck. Record wins, losses, and opponent deck names manually.
- **Links**: Direct links to official Keyforge websites for more deck details.

## Installation

### Option 1: Download APK (Recommended for users)
1. Visit the [Releases](https://github.com/NikLucoz/KeyforgeTracker/releases) page
2. Download the latest APK file
3. Install it directly on your Android device

### Option 2: Build from source (For developers)
1. **Prerequisites**:
   - Node.js (v16 or higher)
   - npm or yarn
   - Expo CLI: `npm install -g @expo/cli`
   - A physical device or emulator for testing
2. **Clone the repository**:
```bash
   git clone https://github.com/NikLucoz/KeyforgeTracker.git
   cd KeyforgeTracker
```
3. **Install dependencies**:
```bash
   npm install
```
4. **Start the development server**:
```bash
   npx expo start
```
5. **Run on device**:
   - Scan the QR code with the Expo Go app on your phone, or
   - Press `a` for Android emulator, `i` for iOS simulator

## Usage
1. **Get your API Key**:
   - Visit [Decks of Keyforge Sellers and Devs page](https://decksofkeyforge.com/about/sellers-and-devs)
   - Generate an API key
2. **Set up the app**:
   - Open the app and go to Settings
   - Enter your API key and save it
3. **Load your decks**:
   - The app will automatically load your decks from the API
   - View deck details and house icons
4. **Track matches**:
   - Select a deck to view its match history
   - Add new matches with wins, losses, and opponent names
   - Edit or delete existing matches

## API Key
This app uses the Decks of Keyforge public API to fetch your deck information. You need a valid API key to access your decks. The API key is stored locally on your device and is not shared with anyone.

## Technologies Used
- React Native
- Expo
- TypeScript
- AsyncStorage for local storage
- Expo Router for navigation

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Decks of Keyforge](https://decksofkeyforge.com/) for providing the API
- [Keyforge Game](https://www.keyforgegame.com/) for the amazing game
- Built with ❤️ for the Keyforge community
