import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateDoc, doc, getDocs, query, collection, where, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { updateDriverStatus } from '../Redux/Slices/driverSlice';

export default function DriverVehicleScanScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const driverData = useSelector((state) => state.driver.driverData);
  const email = driverData.email;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log("Driver status:", driverData.status); 
  
    if (driverData.status) {
      Alert.alert(
        "Already Linked",
        "You are already linked with a vehicle.",
        [
          {
            text: "Remove Link",
            onPress: handleRemoveLink,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return; // Exit function to prevent further scanning
    }
  
    setScanned(true); // Only set scanned if not already linked
  
    try {
      const vehicleQuery = query(collection(firestore, "Vehicle"), where("vehicleCode", "==", data));
      const vehicleSnapshot = await getDocs(vehicleQuery);
  
      if (!vehicleSnapshot.empty) {
        const vehicleData = vehicleSnapshot.docs[0].data();
        setVehicleDetails(vehicleData);
        setShowScanner(false);
  
        Alert.alert("Vehicle QR Scanned!", `Vehicle ID: ${data}`, [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      } else {
        Alert.alert("No Vehicle Found", "No vehicle found with the scanned code.");
        setScanned(false); // Allow rescan if no vehicle found
      }
    } catch (error) {
      Alert.alert("Error Fetching Vehicle", error.message);
      console.error("Error fetching vehicle:", error);
      setScanned(false); // Allow rescan if there was an error
    }
  };
  
  

  const handleRemoveLink = async () => {
    try {
      const linkQuery = query(collection(firestore, "Link"), where("email", "==", email),where("status", "==", true));
      const linkSnapshot = await getDocs(linkQuery);

      if (!linkSnapshot.empty) {
        const linkDocRef = linkSnapshot.docs[0].ref;
        await updateDoc(linkDocRef, { status: false });

        Alert.alert("Link removed", "Vehicle link has been successfully removed.");
        
        await addDoc(collection(firestore, "Link"), {
          email: email,
          registrationNumber: "",
          status: false,
        });

        dispatch(updateDriverStatus({ registrationNumber: "", status: false }));
      } else {
        Alert.alert("No Link Found", "No linked vehicle found for this driver.");
      }
    } catch (error) {
      Alert.alert("Error removing link", error.message);
      console.log("Error removing link", error.message);
    }
  };

  const handleLinkVehicle = async () => {
    if (vehicleDetails) {
      try {
        // Check if the vehicle is already linked to another driver
        const linkQuery = query(
          collection(firestore, "Link"),
          where("registrationNumber", "==", vehicleDetails.registrationNumber),
          where("status", "==", true),
          where("email", "!=", email)
        );
        const linkSnapshot = await getDocs(linkQuery);
  
        if (!linkSnapshot.empty) {
          Alert.alert("Linking Error", "This vehicle is already linked to another driver.");
        } else {
          // Find a document with an empty registration number and false status
          const emptyLinkQuery = query(
            collection(firestore, "Link"),
            where("registrationNumber", "==", ""),
            where("email", "==", email),
            where("status", "==", false)
          );
          const emptyLinkSnapshot = await getDocs(emptyLinkQuery);
  
          if (!emptyLinkSnapshot.empty) {
            // Update the first found document with the new details
            const docRef = emptyLinkSnapshot.docs[0].ref;
            await updateDoc(docRef, {
              email: email,
              registrationNumber: vehicleDetails.registrationNumber,
              status: true,
            });
          } else {
            // Fallback: Add a new document if no empty document is found
            await addDoc(collection(firestore, "Link"), {
              email: email,
              registrationNumber: vehicleDetails.registrationNumber,
              status: true,
            });
          }
  
          // Update the Redux store with the new driver status
          dispatch(updateDriverStatus({
            registrationNumber: vehicleDetails.registrationNumber,
            status: true,
          }));
  
          Alert.alert("Vehicle Linked", "You have successfully linked this vehicle.");
        }
      } catch (error) {
        Alert.alert("Error Linking Vehicle", error.message);
        console.error("Error linking vehicle:", error);
      }
    }
  };
  

  const handleScanAgain = () => {
    setScanned(false);
    setVehicleDetails(null);

  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.driverDetailsContainer}>
        <Text style={styles.detailsText}>Driver Name: {driverData.email}</Text>
        <Text style={styles.detailsText}>License Status: {driverData.status ? "Linked" : "Not Linked"}</Text>
      </View>

      {!showScanner && !vehicleDetails && (
        <Animated.View style={[styles.qrIconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons name="qrcode-scan" size={300} color="#030E25" />
        </Animated.View>
      )}

      {!showScanner && !vehicleDetails ? (
        <Animated.View style={[styles.scanButtonContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity
  style={styles.scanButton}
  onPress={async () => {
    // Call handleBarCodeScanned logic without scanning a QR code yet
    if (driverData.status) {
      Alert.alert(
        "Already Linked",
        "You are already linked with a vehicle.",
        [
          {
            text: "Remove Link",
            onPress: handleRemoveLink,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      // If the driver is not already linked, open the scanner
      setShowScanner(true);
    }
  }}
>
  <Text style={styles.scanButtonText}>Scan Vehicle QR</Text>
</TouchableOpacity>
        </Animated.View>
      ) : (
        showScanner && (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        )
      )}

      {vehicleDetails && (
        <View style={styles.vehicleDetailsContainer}>
          <Text style={styles.detailsText}>Company: {vehicleDetails.company}</Text>
          <Text style={styles.detailsText}>Fuel Type: {vehicleDetails.fuelType}</Text>
          <Text style={styles.detailsText}>Fuel Volume: {vehicleDetails.fuelVolume}</Text>
          <Text style={styles.detailsText}>Registration Number: {vehicleDetails.registrationNumber}</Text>
          <Text style={styles.detailsText}>Vehicle Type: {vehicleDetails.vehicleType}</Text>

          <TouchableOpacity style={styles.rescanButton} onPress={handleScanAgain}>
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={handleLinkVehicle}>
            <Text style={styles.linkText}>Link Vehicle</Text>
          </TouchableOpacity>
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
    marginTop:50,
  },
  scanButton: {
    backgroundColor: "#030E25",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20, // Added margin for spacing between buttons
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily:'Google',

  
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
    fontFamily:'Google',

  },
  rescanButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  rescanText: {
    color: "#030E25",
    fontSize: 18,
    fontFamily:'Google-Bold',
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: "#030E25", // Green color for the Link button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    textAlign: 'center',
    fontFamily:'Google-Bold',

  },
});
