import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import vector icons

export default function ScanQrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // Initially, the scanner is hidden
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for animation
  const pulseAnim = useRef(new Animated.Value(1)).current; // Pulse animation for QR icon

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

    // QR icon pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3, 
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(`QR Code Scanned!`, `Data: ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* QR Icon Animation in the center of the screen */}
      {!showScanner && (
        <Animated.View style={[styles.qrIconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={300}
            color="#030E25" // Dark blue color for the QR icon
          />
        </Animated.View>
      )}

      {/* Scan Button below the QR Icon */}
      {!showScanner ? (
        <Animated.View style={[styles.scanButtonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <Text style={styles.scanButtonText}>Scan Here</Text>
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
  qrIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50, // Add space between the icon and the button
  },
  scanButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50,
  },
  scanButton: {
    backgroundColor: '#030E25',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  scanButtonText: {
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
