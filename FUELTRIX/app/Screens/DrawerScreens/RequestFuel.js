import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';

export default function RequestFuel() {
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
  const handleRequest = () => {
    if (volume === 0 || reason === '') {
      alert('Please fill out all fields.');
    } else {
      // Submit request logic
      alert(`Fuel request submitted. Volume: ${volume}, Reason: ${reason}`);
    }
  };

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#030E25',
    textAlign: 'center',
  },
  volumeContainer: {
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
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
