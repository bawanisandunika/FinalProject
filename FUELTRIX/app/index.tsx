import { Text, View } from "react-native";
import { useFonts } from "expo-font";
export default function Index() {

  const [loaded, error] = useFonts({
    'Google': require('../assets/fonts/Outfit-Regular.ttf'),
  });


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontFamily:'Google'}}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
