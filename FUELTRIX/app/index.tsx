import { Text, View } from "react-native";
import { useFonts } from "expo-font";
import WelcomePage from "./Screens/WelcomeScreen"
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
      <WelcomePage/>
    </View>
  );
}
