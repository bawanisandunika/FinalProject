import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function WelcomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [buttonAnim] = useState(new Animated.Value(50)); // Animation for buttons

  useEffect(() => {
    // Start parallel animations for the logo and buttons
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 1000,
        delay: 1000, // Delay the button appearance for a smoother look
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <FontAwesome5 name="gas-pump" size={140} color="#030E25" />
        <Text style={styles.appName}>FuelTrix</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Efficient Fuel Issuing, Simplified.
      </Animated.Text>

      {/* Animated buttons */}
      <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue as Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue as Pump Assistant</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background for a professional look
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Google-Bold',
    color: '#030E25', 
    marginTop: 30,
  },
  tagline: {
    fontSize: 18,
    color: '#030E25', 
    fontFamily: 'Google',
    marginBottom:60
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: '10%', // Positioning the buttons from the bottom of the screen to 1/3 height
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#030E25', // Button background color
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginVertical: 10,
    width: '80%', // Full width with some margins
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 18,
    fontFamily:'Google-Bold',
  },
});
