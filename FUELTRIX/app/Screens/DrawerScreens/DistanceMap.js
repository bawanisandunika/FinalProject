import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function DistanceMap() {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(0); // Distance in kilometers
  const [previousLocation, setPreviousLocation] = useState(null);

  useEffect(() => {
    let locationSubscription;

    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Get the initial location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setPreviousLocation(currentLocation.coords);

      // Subscribe to location changes
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1, // Get updates every 1 meter
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({ latitude, longitude });

          // Calculate distance from the previous location
          if (previousLocation) {
            const newDistanceInMeters = calculateDistance(
              previousLocation.latitude,
              previousLocation.longitude,
              latitude,
              longitude
            );

            // Update the distance only if it's greater than or equal to 10 meters
            const distanceThreshold = 10; // 10 meters
            if (newDistanceInMeters >= distanceThreshold) {
              const newDistanceInKm = newDistanceInMeters / 1000; // Convert meters to kilometers
              setDistance((prevDistance) => prevDistance + newDistanceInKm);
              setPreviousLocation(newLocation.coords); // Update the previous location after moving 10 meters
            }
          }
        }
      );
    })();

    // Clean up the subscription on component unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Haversine formula to calculate the distance between two points in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the earth in meters
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  };

  return (
    <View style={styles.container}>
      {location ? (
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
          <Marker coordinate={location} />
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
      <View style={styles.info}>
        <Text>Distance traveled: {distance.toFixed(2)} km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%',
  },
  info: {
    padding: 20,
    backgroundColor: 'white',
  },
});
