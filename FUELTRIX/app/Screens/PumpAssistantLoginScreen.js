import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; // Ensure proper Firebase config import
import { useDispatch } from 'react-redux';
import { setPumpAssistant } from '../Redux/Slices/pumpAssistantSlice';

export default function PumpAssistantLoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [buttonAnim] = useState(new Animated.Value(50));
    const [showPassword, setShowPassword] = useState(false);
  

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
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
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateFields = () => {
    let valid = true;

    setEmailError('');
    setPasswordError('');

    const emailRegex = /\S+@\S+\.\S+/;

    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const pumpAssistantQuery = query(
        collection(firestore, 'PumpAssistant'),
        where('email', '==', email),
        where('password', '==', password) // Ensure encrypted password check in production
      );

      const querySnapshot = await getDocs(pumpAssistantQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Assume one document for simplicity
        const userData = userDoc.data();

        // Dispatch to Redux store
        dispatch(
          setPumpAssistant({
            securityCode: userData.securityCode,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          })
        );

        

        Alert.alert('Login Successful', `Welcome ${userData.firstName}!`);
        navigation.navigate('ScanQr');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login: ', error);
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('PumpAssistantSignup');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-circle-left" size={24} color="#030E25" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.formContainer}>

      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

              <Text style={styles.appName1}>Optimize Your Fuel Management!</Text>
        
      <Text style={styles.appName}>FuelTrix Assistant Login</Text>
      </Animated.View>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input */}
        <TextInput
  style={[styles.input, styles.passwordInput]}
           placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
         <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
            <FontAwesome5 name={showPassword ? "eye" : "eye-slash"} size={20} color="#888" />
          </TouchableOpacity>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
       
      </View>

      <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50

  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    color: '#030E25',
    marginLeft: 20,
    fontFamily: 'Google-Bold',
  },
  
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50, // Ensures space for the eye icon
  },
  showPasswordButton: {
    position: 'absolute',
    right: 40, // Adjust the right margin to ensure proper alignment
    top: '83%', // Center the icon vertically
    transform: [{ translateY: -10 }], // Offset to center the icon correctly
  },
  
  appName: {
    fontSize: 32,
    fontFamily: 'Google-Bold',
    color: '#030E25',
    marginBottom:40
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 100,
  },
  appName1: {
    fontSize: 20,
    fontFamily: 'Google-Bold',
    color: '#030E25',
    margin: 0,
    textAlign:'center'

  },
  input: {
    backgroundColor: '#F5F5F5',
    
    
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#030E25',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#030E25',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Google-Bold',
  },
  signUpContainer: {
    marginTop: 20,
  },
  signUpText: {
    color: '#030E25',
    fontSize: 16,
    fontFamily: 'Google',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
