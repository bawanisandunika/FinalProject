import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScanQrScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // Initially, the scanner is hidden
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for animation

  // Request camera permission when the component loads
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Fade in the button on load
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(`QR Code Scanned!`, `Data: ${data}`);
  };

  // Handle "Exit" button press to navigate to welcome page
  const handleExitPress = () => {
    navigation.navigate('Welcome'); // Assuming 'Welcome' is the name of your welcome screen in the navigator
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!showScanner ? (
        <Animated.View style={[styles.scanButtonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <Text style={styles.scanButtonText}>Scan Here</Text>
          </TouchableOpacity>
          {/* Exit button to go back to the welcome screen */}
          <TouchableOpacity
            style={styles.exitButton}
            onPress={handleExitPress}
          >
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scanButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#1c6ef2',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20, // Added margin for spacing between buttons
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  exitButton: {
    backgroundColor: '#d9534f', // Red color for the exit button
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#1c6ef2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  rescanText: {
    color: '#fff',
    fontSize: 18,
  },
});
