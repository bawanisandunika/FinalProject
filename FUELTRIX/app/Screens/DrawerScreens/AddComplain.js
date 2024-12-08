import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useSelector } from 'react-redux';

export default function AddComplain() {
  const [complain, setComplain] = useState(''); // State to store the complaint text
  const driverData = useSelector((state) => state.driver.driverData); // Getting driver data from Redux

  const handleSend = async () => {
    if (complain.trim() === '') {
      Alert.alert('Error', 'Please enter a complaint before sending.');
      return;
    }

    try {
      // Prepare the data to be added to Firestore
      const complainData = {
        driverName: driverData.driverName || 'Unknown', // Ensure fallback if data is missing
        email: driverData.email || 'Unknown',
        registrationNumber: driverData.registrationNumber || 'Unknown',
        complain,
        createdAt: new Date().toISOString(), // Add a timestamp
      };

      // Add the document to the 'Complain' collection
      await addDoc(collection(firestore, 'Complain'), complainData);

      Alert.alert('Success', 'Complaint sent successfully!');
      setComplain(''); // Clear the text field after sending
    } catch (error) {
      console.error('Error sending complaint: ', error);
      Alert.alert('Error', 'Failed to send the complaint. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complain</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write your complain here..."
        value={complain}
        onChangeText={setComplain}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top" // Ensures text starts at the top-left corner
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Google-Bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#030E25',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
