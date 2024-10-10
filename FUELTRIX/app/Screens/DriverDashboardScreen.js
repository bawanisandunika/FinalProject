import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

// View Fuel Usage History screen
function FuelUsageHistoryScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Fuel Usage History</Text>
      {/* Add your content for fuel usage history */}
    </View>
  );
}

function RemainingFuelLimitScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Remaining Fuel Limit</Text>
      {/* Add your content for remaining fuel limit */}
    </View>
  );
}

function SendComplaintScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Send Complaint</Text>
      {/* Add your content for sending complaints */}
      <Button title="Send" onPress={() => alert('Complaint sent!')} />
    </View>
  );
}

function ReviewComplaintStatusScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Review Complaint Status</Text>
      {/* Add your content for reviewing complaint status */}
    </View>
  );
}

// Main Driver Dashboard Screen using Drawer
export default function DriverDashboardScreen() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="FuelUsageHistory"
        screenOptions={{
          drawerLabelStyle: { fontSize: 15, fontWeight: 'bold' },
          drawerActiveTintColor: '#030E25',
          drawerInactiveTintColor: '#888',
        }}
      >
        <Drawer.Screen name="Fuel Usage History" component={FuelUsageHistoryScreen} />
        <Drawer.Screen name="Remaining Fuel Limit" component={RemainingFuelLimitScreen} />
        <Drawer.Screen name="Send Complaint" component={SendComplaintScreen} />
        <Drawer.Screen name="Review Complaint Status" component={ReviewComplaintStatusScreen} />
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
