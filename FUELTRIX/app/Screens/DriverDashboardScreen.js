import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import DistanceMap from './DrawerScreens/DistanceMap';
import FuelUsageScreen from './DrawerScreens/FuelUsageScreen';
import AddComplain from './DrawerScreens/AddComplain';
import TopTabFuel from './DrawerScreens/TopTabFuel';
import TopTabComplain from './DrawerScreens/toptabComplain';
import DriverQrScanScreen from './DriverQrScanScreen';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function CustomHeader({ driverName, email, registrationNumber, status }) {
  
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Hello, {driverName}</Text>
      {status ? (
        <Text style={[styles.registrationNumber, { color: 'green' }]}>
          Link: {registrationNumber}
        </Text>
      ) : (
        <Text style={[styles.registrationNumber, { color: 'red' }]}>
          Not Linked
        </Text>
      )}
    </View>
  );
}



// Custom Drawer Content
function CustomDrawerContent(props) {
  
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerTitleContainer}>
        <Text style={styles.drawerTitle}>FuelTrix</Text>
      </View>
      <DrawerItemList {...props} />
    
    </DrawerContentScrollView>
  );
}


export default function DriverDashboardScreen() {
  // Get driver data from Redux state
  const { driverName, email, registrationNumber, status } = useSelector(state => state.driver.driverData);

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Driver QR Scan"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerLabelStyle: { fontSize: 15, fontFamily: 'Google-Bold' },
          drawerActiveTintColor: '#030E25',
          drawerInactiveTintColor: '#888',
          drawerContentContainerStyle: { backgroundColor: "#d9d9d9" },
          headerTitleStyle: { fontFamily: 'Google-Bold' },
          headerRight: () => (
            <CustomHeader
              driverName={driverName}
              email={email}
              registrationNumber={registrationNumber}
              status={status}
            />
          ),
          headerStyle: { backgroundColor: '#F8F8F8' },
          headerLeftContainerStyle: { backgroundColor: '#DDD', borderBottomRightRadius: 30, borderTopRightRadius: 30, marginBottom: 5 },
        }}
      >
        <Drawer.Screen name="Driver QR Scan" component={DriverQrScanScreen} />
        <Drawer.Screen name="Distance Map" component={DistanceMap} />
        <Drawer.Screen name="Fuel Usage" component={FuelUsageScreen} />
        <Drawer.Screen name="Fuel Requests" component={TopTabFuel} />
        <Drawer.Screen name="Complains" component={TopTabComplain} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: '#030E25',
    fontFamily: 'Google-Bold',
  },
  registrationNumber: {
    fontSize: 14,
    fontFamily: 'Google-Bold',
  },
  drawerTitleContainer: {
    backgroundColor: '#030E25',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  drawerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Google-Bold',
  },

});
