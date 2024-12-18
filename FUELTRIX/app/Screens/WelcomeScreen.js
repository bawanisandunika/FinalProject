import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/FontAwesome';
// Import navigation

export default function WelcomeScreen() {
  const navigation = useNavigation(); // Initialize navigation
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
      {/* Replace FontAwesome5 icon with an Image */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('./../../assets/welcome_image.jpg')} // Ensure correct path to your image
          style={styles.logoImage}
        />
        {/* <Text style={styles.appName}>FuelTrix</Text> */}
      </Animated.View>
      <View style={{textAlign:'center', marginTop:20}} >
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
      <Icon name="check" size={22} color='#030E25' />
       {'  '}Track Fuel Costs

            </Animated.Text> 
            <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
            <Icon name="check" size={22} color='#030E25' />
            {'  '}Fuel Efficiency Insights

            </Animated.Text> 
            <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
     
            <Icon name="check" size={22} color='#030E25' />
            {'  '}Eco-Friendly
            </Animated.Text> 
            <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
         
            <Icon name="check" size={22} color='#030E25' />
            {'  '}Vehicle Management 
            </Animated.Text> 
            </View>

      {/* Animated buttons */}
      <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DriverLogin')}>
          <Text style={styles.buttonText}>Continue as Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PumpLogin')}>
          <Text style={styles.buttonText}>Continue as Pump Assistant</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop:20
  },
  logoContainer: {
    alignItems: 'center',
    marginTop:100,
  },
  logoImage: {
    width: 300, 
    height: 300, 
    resizeMode: 'contain', 
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
    marginTop: 10,
   textAlign:'left'
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: '5%', // Positioning the buttons from the bottom of the screen
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
    fontFamily: 'Google-Bold',
  },
});
