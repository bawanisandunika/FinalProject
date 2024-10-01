import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScanQrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [animationValue] = useState(new Animated.Value(1)); // For button scaling
  const [scannerActive, setScannerActive] = useState(false); // To toggle QR scanner view

  // Request camera permission on mount
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  // Handle QR code scanning
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert('Scanned!', `QR code with type ${type} and data ${data} has been scanned!`);
  };

  // Handle button press animation and scanner activation
  const handlePress = () => {
    Animated.timing(animationValue, {
      toValue: 0.9, // Scale down the button
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animationValue, {
        toValue: 1, // Scale back to original size
        duration: 200,
        useNativeDriver: true,
      }).start();
      setScannerActive(true); // Activate the QR scanner
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scannerActive ? (
        // Show "Scan Here" button when scanner is not active
        <Animated.View style={{ transform: [{ scale: animationValue }] }}>
          <TouchableOpacity style={styles.scanButton} onPress={handlePress} activeOpacity={0.8}>
            <Text style={styles.scanButtonText}>Scan Here</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        // Show QR scanner once the button is pressed
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
              <Text style={styles.buttonText}>Tap to Scan Again</Text>
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
    backgroundColor: '#003366', // Petrol blue theme for petrol shed feel
  },
  scanButton: {
    backgroundColor: '#FFD700', // Bright yellow like petrol pump
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  scanButtonText: {
    color: '#003366', // Petrol blue text
    fontSize: 20,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});
