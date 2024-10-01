import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Animatable from 'react-native-animatable'; // Animations for scanning

export default function ScanQrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    startAnimation(); // Start animation on component mount
  }, []);

  // Handle QR code scanning
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned', `Type: ${type}\nData: ${data}`, [{ text: 'OK', onPress: () => setScanned(false) }]);
  };

  // Animation logic (up and down movement)
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // If camera permission is not granted
  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Interpolate animation value to move scanner line
  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust range as per your design
  });

  return (
    <View style={styles.container}>
      {/* QR Scanner View */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Scanning Area */}
        <View style={styles.scannerArea}>
          <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.scannerFrame}>
            <Text style={styles.scanText}>Align the QR code within the frame</Text>
            {/* Animated Scanner Line */}
            <Animated.View style={[styles.scannerLine, { transform: [{ translateY }] }]} />
          </Animatable.View>
        </View>
      </BarCodeScanner>

      {/* Button to scan again */}
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={styles.scanAgainButton}>
          <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderColor: '#FFF',
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  scannerLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'red',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
  },
  scanAgainText: {
    color: '#000',
    fontSize: 16,
  },
});
