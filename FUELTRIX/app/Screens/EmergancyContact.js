import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Using FontAwesome for icons

export default function EmergencyContact() {
  const fadeAnim = new Animated.Value(0); // Initial opacity for animation

  // Start the fade-in animation
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const emergencyContacts = [
    { name: 'Head Office', number: '123-456-7890', icon: 'building' },
    { name: 'Fire Department', number: '987-654-3210', icon: 'fire' },
    { name: 'Mechanical Unit', number: '456-789-1230', icon: 'wrench' },
    { name: 'Ambulance Service', number: '321-654-0987', icon: 'ambulance' },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Emergency Contacts</Text>
      {emergencyContacts.map((contact, index) => (
        <TouchableOpacity key={index} style={styles.contactCard} onPress={() => alert(`Calling ${contact.name} at ${contact.number}`)}>
          <FontAwesome name={contact.icon} size={30} color="#FF6347" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactNumber}>{contact.number}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  contactInfo: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 16,
    color: '#555',
  },
});
