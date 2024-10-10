import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import AddComplain from './AddComplain'; // Adjust the import path as needed
import ReviewComplain from './ReviewComplain'; // Create this component

const Tab = createMaterialTopTabNavigator();

export default function TopTabComplain() {
  return (
    <Tab.Navigator
    screenOptions={{
        tabBarStyle: {
          backgroundColor: '#F8F9FA', // Light gray background for the tab bar
          elevation: 2, // Add shadow for depth
        },
        tabBarActiveTintColor: '#030E25', // Color for the active tab label
        tabBarInactiveTintColor: '#6c757d', // Color for the inactive tab label
        tabBarLabelStyle: {
          fontFamily:'Google-Bold', // Bold text for labels
          fontSize: 12, // Font size for tab labels
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#030E25', // Color for the active tab indicator
          height: 4, // Thickness of the indicator
        },
        
      }}
    >
    <Tab.Screen name="send Complain" component={AddComplain} />
    <Tab.Screen name="Review Complain" component={ReviewComplain} />
  </Tab.Navigator>
  )
}