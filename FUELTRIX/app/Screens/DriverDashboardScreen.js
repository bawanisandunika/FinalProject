import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DistanceMap from './DrawerScreens/DistanceMap';
import FuelUsageScreen from './DrawerScreens/FuelUsageScreen';
import AddComplain from './DrawerScreens/AddComplain'
import TopTabFuel from './DrawerScreens/TopTabFuel'
import TopTabComplain from './DrawerScreens/toptabComplain';

// Create Drawer Navigator
const Drawer = createDrawerNavigator();


export default function DriverDashboardScreen() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Distance Map"
        screenOptions={{
          drawerLabelStyle: { fontSize: 15, fontFamily:'Google-Bold' },
          drawerActiveTintColor: '#030E25',
          drawerInactiveTintColor: '#888',
          headerTitleStyle: { fontFamily:'Google-Bold'},
          headerLeftContainerStyle: {backgroundColor:'#DDD',borderBottomRightRadius:30,borderTopRightRadius:30,marginBottom:5}
        }}
      >
        <Drawer.Screen name="Distance Map" component={DistanceMap}/>
        <Drawer.Screen name="Fuel Usage" component={FuelUsageScreen} />
        <Drawer.Screen name="Fuel Requests" component={TopTabFuel} />
        <Drawer.Screen name="Complains" component={TopTabComplain} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#030E25',
  },
});
