import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../Screens/WelcomeScreen'
import PumpLoginScreen from '../Screens/PumpAssistantLoginScreen'
import PumpAssistantSignUpScreen from '../Screens/Signup/PumpAssistantSignUpScreen'
import DriverSignUpScreen from '../Screens/Signup/DriverSignUpScreen'
import ScanQrScreen from '../Screens/ScanQrScreen'
import DriverQrScanScreen from '../Screens/DriverQrScanScreen'
import DriverHomePageScreen from '../Screens/DriverHomePageScreen'
import DriverLoginScreen from '../Screens/DriverLoginScreen'
import DriverDashboardScreen from '../Screens/DriverDashboardScreen';


const Stack = createStackNavigator()

export default function MainNavigation() {
  return (
   
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={WelcomeScreen} />
      <Stack.Screen name="PumpLogin" component={PumpLoginScreen} />
      <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
      <Stack.Screen name="PumpAssistantSignup" component={PumpAssistantSignUpScreen} />
      <Stack.Screen name="DriverSignup" component={DriverSignUpScreen} />
      <Stack.Screen name="ScanQr" component={ScanQrScreen} />
      <Stack.Screen name="DriverHome" component={DriverHomePageScreen} />
      <Stack.Screen name="DriverQr" component={DriverQrScanScreen} />
      <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
      




      
    </Stack.Navigator>
 
  )
}