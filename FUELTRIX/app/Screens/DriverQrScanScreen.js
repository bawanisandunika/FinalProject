import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function DriverVehicleScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(null); // Holds vehicle details after scanning
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

    // Simulating fetching vehicle details from QR code data
    const fetchedVehicleDetails = {
      id: data,
      model: 'Toyota Prius',
      plate: 'XYZ 1234',
      year: 2020,
      owner: 'John Doe',
    };

    setVehicleDetails(fetchedVehicleDetails);
    Alert.alert(`Vehicle QR Scanned!`, `Vehicle ID: ${fetchedVehicleDetails.id}`);
  };

  // Handle "Scan Again" button press to reset scanning
  const handleScanAgain = () => {
    setScanned(false);
    setVehicleDetails(null); // Reset vehicle details
  };

  // Handle "Exit" button press to navigate to the driver home page
  const handleExitPress = () => {
    navigation.navigate('DriverHome'); // Assuming 'DriverHome' is the name of your driver's home screen
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
            <Text style={styles.scanButtonText}>Scan Vehicle QR</Text>
          </TouchableOpacity>
          {/* Exit button to go back to driver's home screen */}
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
          {scanned && vehicleDetails ? (
            <View style={styles.vehicleDetailsContainer}>
              <Text style={styles.detailsText}>Vehicle Model: {vehicleDetails.model}</Text>
              <Text style={styles.detailsText}>Plate Number: {vehicleDetails.plate}</Text>
              <Text style={styles.detailsText}>Year: {vehicleDetails.year}</Text>
              <Text style={styles.detailsText}>Owner: {vehicleDetails.owner}</Text>

              {/* Button to scan again */}
              <TouchableOpacity
                style={styles.rescanButton}
                onPress={handleScanAgain}
              >
                <Text style={styles.rescanText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          ) : null}
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
  vehicleDetailsContainer: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '90%',
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  rescanButton: {
    backgroundColor: '#1c6ef2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  rescanText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
