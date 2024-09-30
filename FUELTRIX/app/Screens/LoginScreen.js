import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [buttonAnim] = useState(new Animated.Value(50));

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

  const validateEmail = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = () => {
    if (validateEmail() && validatePassword()) {
      Alert.alert('Login Successful', 'Welcome back!');
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
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          onBlur={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          onBlur={validatePassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: buttonAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
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
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#030E25',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Google-Bold',
  },
});
