import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Modal, TextInput, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, query, where,doc, updateDoc, addDoc  } from "firebase/firestore";
import { firestore } from '../../firebaseConfig';
import { BarChart } from "react-native-chart-kit";
import { useSelector } from 'react-redux';

const { width } = Dimensions.get("window");

export default function ScanQrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [pumpModalVisible, setPumpModalVisible] = useState(false);
  const [fuelInput, setFuelInput] = useState('');
  const [canShowScanButton, setCanShowScanButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const pumpAssistant = useSelector((state) => state.pumpAssistant);
  console.log(pumpAssistant)

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

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
  
    try {
      const vehicleQuery = query(
        collection(firestore, 'Vehicle'),
        where('vehicleCode', '==', data)
      );
      const querySnapshot = await getDocs(vehicleQuery);
  
      if (!querySnapshot.empty) {
        const vehicleData = querySnapshot.docs[0].data();
        setVehicleDetails(vehicleData);
        console.log(vehicleData)
  
        // Check Link collection for registration number and status
        const linkQuery = query(
          collection(firestore, 'Link'),
          where('status', '==', true),
          where('registrationNumber', '==', vehicleData.registrationNumber)
        );
        const linkSnapshot = await getDocs(linkQuery);
        
        if (!linkSnapshot.empty) {
          const linkData = linkSnapshot.docs[0].data();
          console.log(linkData);
        
          setCanShowScanButton(true); // Enable Pump Button
          setModalVisible(true); // Show Modal
          Alert.alert('Vehicle Validated', 'You can now pump fuel.');
        } else {
          setCanShowScanButton(false); // Disable Pump Button
          setModalVisible(true); // Still show the modal with the message
          setVehicleDetails(null); // Clear vehicle details if any
          Alert.alert('Validation Failed', 'Driver is not linked to this vehicle.');
        }
        
        
  
        setModalVisible(true);
      } else {
        Alert.alert('Vehicle Not Found', 'No vehicle details found for this QR code.');
        setVehicleDetails({});
        setCanShowScanButton(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch vehicle details. Please try again.');
      console.error(error);
    }
  };
  

  const handlePump = () => {
    const remainingFuel = (vehicleDetails?.fuelVolume || 0) - (vehicleDetails?.pumpedVolume || 0);

    if (remainingFuel <= 0) {
      Alert.alert('Fuel Limit Exceeded', 'You have reached the maximum fuel limit.');
    } else {
      setPumpModalVisible(true);
    }
  };

  const handleConfirmPump = async () => {
    const remainingFuel = (vehicleDetails?.fuelVolume || 0) - (vehicleDetails?.pumpedVolume || 0);
    const fuelToPump = parseFloat(fuelInput);
  
    if (fuelToPump > remainingFuel) {
      Alert.alert('Invalid Input', `You can only pump up to ${remainingFuel} liters.`);
      return;
    }
  
    try {
      // Fetch Shed details
      let shedDetails = null;
      const shedQuery = query(
        collection(firestore, 'Shed'),
        where('Security_Key', '==', pumpAssistant.securityCode)
      );
      const shedSnapshot = await getDocs(shedQuery);
  
      if (!shedSnapshot.empty) {
        shedDetails = shedSnapshot.docs[0].data();
        console.log(shedDetails);
      } else {
        Alert.alert('Error', 'No shed found for the given security code.');
        return;
      }
  
      // Update Vehicle document
      const vehicleQuery = query(
        collection(firestore, 'Vehicle'),
        where('vehicleCode', '==', vehicleDetails.vehicleCode)
      );
      const vehicleSnapshot = await getDocs(vehicleQuery);
  
      if (!vehicleSnapshot.empty) {
        const vehicleDoc = vehicleSnapshot.docs[0];
        const vehicleRef = doc(firestore, 'Vehicle', vehicleDoc.id); // Get the document reference
        await updateDoc(vehicleRef, {
          pumpedVolume: (vehicleDetails.pumpedVolume || 0) + fuelToPump,
        });
      }
  
      // Create Pump record
      const pumpRecord = {
        vehicleCode: vehicleDetails.vehicleCode,
        fuelPumped: fuelToPump,
        shedName: shedDetails.shedName, // Using shedDetails
        shedType: shedDetails.shedType, // Using shedDetails
        fuelType: vehicleDetails.fuelType,
        company: vehicleDetails.company,
        assistantFirstName: pumpAssistant?.firstName || 'Unknown Assistant',
        assistantLastName: pumpAssistant?.lastName || 'Unknown Assistant',
        pumpTime: new Date().toISOString(),
      };
  
      // Add to Pump collection
      await addDoc(collection(firestore, 'Pump'), pumpRecord);
  
      Alert.alert('Pumping Successful', `You have pumped ${fuelToPump} liters.`);
      setVehicleDetails((prevDetails) => ({
        ...prevDetails,
        pumpedVolume: (prevDetails.pumpedVolume || 0) + fuelToPump,
      }));
      setFuelInput('');
      setPumpModalVisible(false);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to process the pump details. Please try again.');
      console.error(error);
    }
  };
  
  

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Display Pump Assistant Details */}
     
      {!showScanner && (
        <Animated.View style={[styles.qrIconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={200}
            color="#030E25"
          />
        </Animated.View>
      )}

      {!showScanner ? (
        <Animated.View style={[styles.scanButtonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
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
              onPress={() => {
                setScanned(false);
                setVehicleDetails({});
              }}
            >
              <Text style={styles.rescanText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal for Vehicle Details */}
     {/* Modal for Vehicle Details */}
     {modalVisible && (
  <Modal
    visible={modalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {/* Conditional Content */}
        {vehicleDetails ? (
          <>
            {/* Vehicle Details */}
            <Text style={styles.modalTitle}>Vehicle Details</Text>
            <Text style={styles.modalText}>Company: {vehicleDetails.company}</Text>
            <Text style={styles.modalText}>Fuel Type: {vehicleDetails.fuelType}</Text>
            <Text style={styles.modalText}>Fuel Limit: {vehicleDetails.fuelVolume}L</Text>
            <Text style={styles.modalText}>Current Usage: {vehicleDetails.pumpedVolume}L</Text>
            <Text style={styles.modalText}>
              Remaining: {vehicleDetails.fuelVolume - vehicleDetails.pumpedVolume}L
            </Text>

            {/* Bar Chart */}
            <BarChart
              data={{
                labels: ["Fuel Limit", "Used", "Remaining"],
                datasets: [
                  {
                    data: [
                      vehicleDetails.fuelVolume,
                      vehicleDetails.pumpedVolume,
                      vehicleDetails.fuelVolume - vehicleDetails.pumpedVolume,
                    ],
                  },
                ],
              }}
              width={width * 0.7}
              height={350}
              yAxisSuffix="L"
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#f4f4f4",
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              {canShowScanButton && (
                <TouchableOpacity style={styles.modalButton} onPress={handlePump}>
                  <Text style={styles.modalButtonText}>Pump</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                onPress={() => {
                  setScanned(false);
                  setVehicleDetails(null);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>Driver is not linked to this vehicle.</Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#f44336' }]}
              onPress={() => {
                setScanned(false);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  </Modal>
)}


{/* Pump Modal */}
{pumpModalVisible && (
  <Modal
    visible={pumpModalVisible}
    animationType="fade"
    transparent={true}
    onRequestClose={() => setPumpModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setPumpModalVisible(false)}
        >
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Pump Fuel</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter fuel amount"
          keyboardType="numeric"
          value={fuelInput}
          onChangeText={setFuelInput}
        />
        <TouchableOpacity style={styles.modalButton} onPress={handleConfirmPump}>
          <Text style={styles.modalButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
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
  },
  scanButtonContainer: {
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#030E25',
    padding: 15,
    borderRadius: 10,
    marginTop:30
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'Google'
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
    backgroundColor: '#030E25',
    padding: 10,
    borderRadius: 5,
    fontFamily:'Google'
  },
  rescanText: {
    color: '#fff',
    fontSize: 14,
    fontFamily:'Google'

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily:'Google-Bold'

  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily:'Google'

  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#030E25',
    padding: 10,
    paddingHorizontal:40,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily:'Google-Bold',
    textAlign:'center'

  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 30,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  
});



























