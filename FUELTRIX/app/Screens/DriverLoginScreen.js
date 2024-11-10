import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { firestore } from '../../firebaseConfig';
import { useDispatch } from 'react-redux';
import { setDriverData } from '../Redux/Slices/driverSlice';

export default function DriverLoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [buttonAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 0, duration: 1000, delay: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }
  
    try {
      const driverQuery = query(
        collection(firestore, "Driver"),
        where("email", "==", email),
        where("password", "==", password)
      );
  
      const driverSnapshot = await getDocs(driverQuery);
  
      if (!driverSnapshot.empty) {
        const driverData = driverSnapshot.docs[0].data();
        const driverName = driverData.name;
        let registrationNumber = "";
        let status = false;
  
        const linkQuery = query(collection(firestore, "Link"), where("email", "==", email));
        const linkSnapshot = await getDocs(linkQuery);
  
        if (!linkSnapshot.empty) {
          const linkData = linkSnapshot.docs[0].data();
          registrationNumber = linkData.registrationNumber;
          status = linkData.status;
        } else {
          await addDoc(collection(firestore, "Link"), {
            email: email,
            registrationNumber: "",
            status: false,
          });
        }
  
        const driverPayload = { driverName, email, registrationNumber, status };
        console.log("Dispatching to Redux:", driverPayload); // Debug line
  
        dispatch(setDriverData(driverPayload));
        navigation.navigate('DriverDashboard');
      } else {
        Alert.alert("Error", "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-circle-left" size={24} color="#030E25" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.appName1}>FuelTrix</Text>
      <Text style={styles.appName}>Welcome and Drive Safe!</Text>
      <FontAwesome5 name="gas-pump" size={100} color="#030E25" />
    

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <Animated.View style={[styles.buttonsContainer, { transform: [{ translateY: buttonAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName1: {
    fontSize: 20,
    fontFamily: 'Google-Bold',
    color: '#030E25',
    margin: 0,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Google-Bold',
    color: '#030E25',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginVertical: 30,
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
});
