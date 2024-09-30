import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function DriverSignupScreen() {
  const [companyId, setCompanyId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [companyIdError, setCompanyIdError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [buttonAnim] = useState(new Animated.Value(50)); // Animation for buttons

  useEffect(() => {
    // Start animations
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
        delay: 1000, // Delay the button appearance
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateFields = () => {
    let valid = true;

    // Reset all errors
    setCompanyIdError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!companyId) {
      setCompanyIdError('Company ID is required');
      valid = false;
    }

    if (!firstName) {
      setFirstNameError('First Name is required');
      valid = false;
    }

    if (!lastName) {
      setLastNameError('Last Name is required');
      valid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    return valid;
  };

  const handleSignup = () => {
    if (validateFields()) {
      // Proceed with the signup process
      Alert.alert('Signup Successful', 'Welcome to FuelTrix!');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <FontAwesome5 name="gas-pump" size={100} color="#030E25" />
        <Text style={styles.appName}>FuelTrix</Text>
      </Animated.View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Company ID"
          placeholderTextColor="#aaa"
          value={companyId}
          onChangeText={(text) => setCompanyId(text)}
          onBlur={() => !companyId && setCompanyIdError('Company ID is required')}
        />
        {companyIdError ? <Text style={styles.errorText}>{companyIdError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          onBlur={() => !firstName && setFirstNameError('First Name is required')}
        />
        {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#aaa"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          onBlur={() => !lastName && setLastNameError('Last Name is required')}
        />
        {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(text) => setEmail(text)}
          onBlur={() => !email && setEmailError('Email is required')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onBlur={() => password.length < 6 && setPasswordError('Password must be at least 6 characters')}
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          onBlur={() => password !== confirmPassword && setConfirmPasswordError('Passwords do not match')}
          secureTextEntry
          autoCapitalize="none"
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        {/* Animated signup button */}
        <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: buttonAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.socialButtonsContainer}>
          <Text style={styles.socialText}>Or sign up with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="facebook" size={24} color="#4267B2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Google-Bold',
    color: '#030E25',
    marginTop: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  input: {
    borderColor: '#030E25',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'Google',
    color: '#030E25',
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#030E25',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Google-Bold',
  },
  socialButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 16,
    color: '#030E25',
    fontFamily: 'Google',
  },
  socialButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
  },
  socialButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#030E25',
  },
});
