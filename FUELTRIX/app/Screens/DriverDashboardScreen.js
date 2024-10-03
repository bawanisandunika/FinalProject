import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Create Tab navigator
const Tab = createMaterialTopTabNavigator();

// View Fuel Usage History screen
function FuelUsageHistoryScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Fuel Usage History</Text>
      {/* Add your content for fuel usage history */}
    </View>
  );
}

// Remaining Fuel Limit screen
function RemainingFuelLimitScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Remaining Fuel Limit</Text>
      {/* Add your content for remaining fuel limit */}
    </View>
  );
}

// Send Complaint screen
function SendComplaintScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Send Complaint</Text>
      {/* Add your content for sending complaints */}
      <Button title="Send" onPress={() => alert('Complaint sent!')} />
    </View>
  );
}

// Review Complaint Status screen
function ReviewComplaintStatusScreen() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.tabText}>Review Complaint Status</Text>
      {/* Add your content for reviewing complaint status */}
    </View>
  );
}

// Main DriverDashboardScreen using Tab navigator
export default function DriverDashboardScreen() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#1c6ef2' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#dcdcdc',
          tabBarIndicatorStyle: { backgroundColor: '#fff' },
        }}
      >
        <Tab.Screen name="Fuel Usage History" component={FuelUsageHistoryScreen} />
        <Tab.Screen name="Remaining Fuel Limit" component={RemainingFuelLimitScreen} />
        <Tab.Screen name="Send Complaint" component={SendComplaintScreen} />
        <Tab.Screen name="Review Complaint Status" component={ReviewComplaintStatusScreen} />
      </Tab.Navigator>
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
    color: '#1c6ef2',
  },
});
