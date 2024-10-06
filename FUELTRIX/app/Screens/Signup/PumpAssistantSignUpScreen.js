import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Picker for combo box (dropdown)
import { ScrollView } from 'react-native';

export default function PumpAssistantSignUpScreen() {
  const [district, setDistrict] = useState('');
  const [shedId, setShedId] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [districtError, setDistrictError] = useState('');
  const [shedIdError, setShedIdError] = useState('');
  const [securityCodeError, setSecurityCodeError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Updated list of all 25 districts
  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const validateFields = () => {
    let valid = true;

    // Reset all errors
    setDistrictError('');
    setShedIdError('');
    setSecurityCodeError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!district) {
      setDistrictError('Shed name is required');
      valid = false;
    }

    if (!shedId) {
      setShedIdError('Shed ID is required');
      valid = false;
    }

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

  const handleRegister = () => {
    if (validateFields()) {
      Alert.alert('Registration Successful', 'Welcome to FuelTrix!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        {/* District (Combo Box) */}
        <Text style={styles.label}>Select Shed</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={district}
            onValueChange={(itemValue) => setDistrict(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Shed Name" value="" />
            {districts.map((district, index) => (
              <Picker.Item key={index} label={district} value={district} />
            ))}
          </Picker>
        </View>
        {districtError ? <Text style={styles.errorText}>{districtError}</Text> : null}

      
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  formContainer: {
    width: '90%',
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderColor: '#030E25',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    color: '#030E25',
  },
  input: {
    borderColor: '#030E25',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#030E25',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#030E25',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#030E25',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
