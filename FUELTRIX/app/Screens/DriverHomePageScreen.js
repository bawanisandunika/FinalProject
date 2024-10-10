import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you are using React Navigation for navigating between screens

export default function DriverHomePageScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for fade animation

  useEffect(() => {
    // Start the fade-in animation on component load
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>Welcome, to FuelTrix!</Text>
        <Text style={styles.subText}>Choose an option to proceed:</Text>
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('DriverQr')} // Navigates to the Scan Vehicle QR screen
        >
          <Text style={styles.buttonText}>Scan Vehicle QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => navigation.navigate('DriverDashboard')}
        >
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcomeContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366', // Petrol shed blue
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#030E25',
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  dashboardButton: {
    backgroundColor: '#999',
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Google-Bold',
  
  },
});
