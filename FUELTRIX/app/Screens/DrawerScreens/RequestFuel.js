import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { addDoc, collection,query,where,getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

export default function RequestFuel() {
  const driverData = useSelector((state) => state.driver.driverData);
  const { email, registrationNumber, status } = driverData;
  const [volume, setVolume] = useState(0); // Initialize volume with 0
  const [reason, setReason] = useState(''); // Initialize reason as an empty string

  // Function to increase volume
  const incrementVolume = () => {
    setVolume(volume + 1);
  };

  // Function to decrease volume
  const decrementVolume = () => {
    if (volume > 0) {
      setVolume(volume - 1);
    }
  };

  // Handle form submission
  const handleRequest = async () => {
    if (volume === 0 || reason === '') {
      alert('Please fill out all fields.');
      return;
    }
  
    try {
      // Query the Vehicle collection to get the company for the registration number
      const vehicleQuery = query(
        collection(firestore, 'Vehicle'),
        where('registrationNumber', '==', registrationNumber)
      );
      const vehicleQuerySnapshot = await getDocs(vehicleQuery);
  
      if (vehicleQuerySnapshot.empty) {
        alert('No vehicle found with the provided registration number.');
        return;
      }
  
      // Get the company data from the first matching document
      const vehicleData = vehicleQuerySnapshot.docs[0].data();
      const company = vehicleData.company || 'Unknown'; // Default to 'Unknown' if no company field is found
  
      // Add the fuel request to Firestore, including the company information
      const docRef = await addDoc(collection(firestore, 'FuelRequests'), {
        email,
        registrationNumber,
        company, // Include the company in the fuel request
        requestVolume: volume,
        reason,
        requestedAt: new Date(), // Add a timestamp
        approvedStatus: 'pending',
      });
  
      alert('Fuel request submitted successfully!');
      console.log('Document written with ID: ', docRef.id);
  
      // Reset form fields
      setVolume(0);
      setReason('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to submit fuel request. Please try again.');
    }
  };
  

  // Show a message if status is false
  if (!status) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.linkText}>Please link to a vehicle to request fuel.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Volume field with increment/decrement buttons */}
        <View style={styles.volumeContainer}>
          <TouchableOpacity style={[styles.button, styles.elevation]} onPress={decrementVolume}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.volumeText}>{volume} Liters</Text>
          <TouchableOpacity style={[styles.button, styles.elevation]} onPress={incrementVolume}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Reason text area */}
        <TextInput
          style={[styles.textArea, styles.elevation]}
          placeholder="Reason for fuel request"
          value={reason}
          onChangeText={setReason}
          multiline={true}
          numberOfLines={4}
        />
      </ScrollView>

      {/* Request button fixed at the bottom */}
      <TouchableOpacity style={[styles.requestButton, styles.elevation]} onPress={handleRequest}>
        <Text style={styles.requestButtonText}>Request Fuel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-end', // Ensures button is always at the bottom
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space above the bottom button
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  linkText: {
    fontSize: 16,
    color: '#ff6347',
    fontFamily: 'Google-Bold',
    textAlign: 'center',
  },
  volumeContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#030E25',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  volumeText: {
    fontSize: 18,
    color: '#333',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 30,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  requestButton: {
    backgroundColor: '#aaa',
    paddingVertical: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
  },
  requestButtonText: {
    color: '#030E25',
    fontSize: 18,
    fontWeight: 'bold',
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
