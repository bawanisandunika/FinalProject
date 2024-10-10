import { Text, View } from "react-native";
import { useFonts } from "expo-font";
import WelcomePage from "./Screens/WelcomeScreen"
import LoginScreen from "./Screens/PumpAssistantLoginScreen"
import DriverSignUpScreen from "./Screens/Signup/DriverSignUpScreen"
import PumpAssistantSignUpScreen from "./Screens/Signup/PumpAssistantSignUpScreen"
import ScanQrScreen from "./Screens/ScanQrScreen"
import DriverQrScanScreen from "./Screens/DriverQrScanScreen"
import DriverHomePageScreen from "./Screens/DriverHomePageScreen"
import DriverDashboardScreen from "./Screens/DriverDashboardScreen"
import EmergancyContact from "./Screens/EmergancyContact"
import MainNavigation from './Navigation/MainNavigation'


export default function Index() {

  const [fontsLoaded] = useFonts({
    'Google': require('../assets/fonts/Outfit-Regular.ttf'),
    'Google-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });
 if(!fontsLoaded)
 {
  return null;
 }

  return (
    <View
      style={{flex:1}}
    >
      <MainNavigation/>
      
    </View>
  );
}
