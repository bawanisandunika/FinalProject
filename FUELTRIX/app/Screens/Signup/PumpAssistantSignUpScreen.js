import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native';
import { doc, getDoc, query, where, collection, getDocs, addDoc } from "firebase/firestore"; // Added addDoc
import { firestore } from '../../../firebaseConfig';  // Ensure correct Firebase config
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [securityCode, setSecurityCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [securityCodeError, setSecurityCodeError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateFields = () => {
    let valid = true;

    // Reset errors
    setSecurityCodeError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validation
    if (!securityCode) {
      setSecurityCodeError('Security Code is required');
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

  const handleRegister = async () => {
    if (validateFields()) {
      try {
        // Query to check if the security code exists and Approved_status is true
        const shedQuery = query(
          collection(firestore, 'Shed'),
          where('Security_Key', '==', securityCode),
          where('Approved_status', '==', true)
        );
  
        const shedSnapshot = await getDocs(shedQuery);
  
        if (!shedSnapshot.empty) {
          // Security code is valid
          await addDoc(collection(firestore, 'PumpAssistant'), {
            securityCode,
            firstName,
            lastName,
            email,
            password, // Use Firebase Authentication in real apps for password handling
          });
  
          Alert.alert('Registration Successful', 'Welcome to FuelTrix!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PumpLogin'), // Navigate to the Login screen
            },
          ]);
        } else {
          // Invalid security code or shed not approved
          Alert.alert('Invalid Security Code', 'Security Code is invalid or Shed is not approved.');
        }
      } catch (error) {
        console.error('Error adding document: ', error);
        Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-circle-left" size={24} color="#030E25" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.formContainer}>
      <Text style={styles.title}>Sign Up with FuelTrix</Text>

        {/* Security Code */}
        <TextInput
          style={styles.input}
          placeholder="Security Code"
          placeholderTextColor="#aaa"
          value={securityCode}
          onChangeText={(text) => setSecurityCode(text)}
          onBlur={() => !securityCode && setSecurityCodeError('Security Code is required')}
        />
        {securityCodeError ? <Text style={styles.errorText}>{securityCodeError}</Text> : null}

        {/* First Name */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          onBlur={() => !firstName && setFirstNameError('First Name is required')}
        />
        {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

        {/* Last Name */}
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#aaa"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          onBlur={() => !lastName && setLastNameError('Last Name is required')}
        />
        {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 45,
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
  formContainer: {
    width: '90%',
    paddingHorizontal: 10,
    marginTop:50
  },
  title: {
    marginVertical:20,
    fontSize: 24,
    fontFamily: 'Google-Bold',
    color: '#030E25', // You can adjust the color as needed
    marginBottom: 20, // Space between title and form
    textAlign: 'center', // Center the title
  },
  input: {
    backgroundColor: '#F5F5F5',
    
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
    fontSize: 16,
    color: '#030E25',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: '#030E25',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop:50
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Google-Bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -20,
  },
});
