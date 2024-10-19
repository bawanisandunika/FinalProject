import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { firestore } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import * as geocoding from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function ShedLocationsMap() {
  const [location, setLocation] = useState(null);
  const [approvedLocations, setApprovedLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMapData(); 
  }, []);

  const fetchMapData = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(userLocation);

      const q = query(
        collection(firestore, 'Shed'),
        where('Approved_status', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const locations = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const locationString = data.location;

        return { locationString, shedName: data.shedName };
      });

      const coordinatesPromises = locations.map(async (loc) => {
        const coordinates = await convertAddressToCoordinates(loc.locationString);
        return { ...loc, coordinates }; 
      });

      const locationsWithCoordinates = await Promise.all(coordinatesPromises);
      setApprovedLocations(locationsWithCoordinates); 

      findNearestShed(userLocation, locationsWithCoordinates);

    } catch (error) {
      console.error('Error fetching approved locations: ', error);
    } finally {
      setLoading(false);
    }
  };

  const convertAddressToCoordinates = async (address) => {
    try {
      const geocodeResult = await geocoding.geocodeAsync(address);
      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];
        return { latitude, longitude };
      }
      return null;
    } catch (error) {
      console.error('Error converting address to coordinates: ', error);
      return null;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  const findNearestShed = (userLocation, locations) => {
    if (!locations.length) return;

    let nearestLocation = null;
    let shortestDistance = Number.MAX_VALUE;

    locations.forEach((loc) => {
      const { coordinates } = loc;
      if (coordinates) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordinates.latitude,
          coordinates.longitude
        );
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestLocation = loc;
        }
      }
    });

    if (nearestLocation) {
      Alert.alert(
        'Nearest Shed',
        `The nearest shed is ${nearestLocation.shedName}. It is approximately ${shortestDistance.toFixed(2)} km away. Do you want to navigate there?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Navigate',
            onPress: () => navigateToShed(nearestLocation.coordinates),
          },
        ]
      );
    }
  };

  const navigateToShed = (coordinates) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
    Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : location ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            {approvedLocations.map((loc, index) => {
              const { coordinates } = loc;
              return coordinates ? (
                <Marker
                  key={index}
                  coordinate={coordinates}
                  title={loc.shedName}
                />
              ) : null;
            })}
          </MapView>

          <TouchableOpacity style={styles.reloadButton} onPress={fetchMapData}>
            <Ionicons name="reload" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading map...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  reloadButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
