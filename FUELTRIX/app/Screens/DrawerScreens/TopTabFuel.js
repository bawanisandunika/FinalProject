import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import RequestFuel from './RequestFuel'; // Adjust the import path as needed
import ReviewRequest from './ReviewRequest'; // Create this component

const Tab = createMaterialTopTabNavigator();

export default function TopTabFuel() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#F8F9FA', 
          elevation: 2, 
        },
        tabBarActiveTintColor: '#030E25', // Color for the active tab label
        tabBarInactiveTintColor: '#6c757d', // Color for the inactive tab label
        tabBarLabelStyle: {
          fontFamily:'Google-Bold', // Bold text for labels
          fontSize: 15, // Font size for tab labels
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#030E25', // Color for the active tab indicator
          height: 4, // Thickness of the indicator
        },
        
      }}
    >
      <Tab.Screen name="Request Fuel" component={RequestFuel} />
      <Tab.Screen name="Review Request" component={ReviewRequest} />
    </Tab.Navigator>
  );
}
