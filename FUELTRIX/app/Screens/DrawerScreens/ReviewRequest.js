import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { firestore } from '../../../firebaseConfig';

export default function FuelRequests() {
  const [requests, setRequests] = useState([]); // State to store fuel requests
  const [loading, setLoading] = useState(true); // Loading indicator for initial fetch
  const [refreshing, setRefreshing] = useState(false); // Refreshing indicator
  const driverData = useSelector((state) => state.driver.driverData);
  const { email } = driverData;

  // Fetch fuel requests from Firestore
  const fetchRequests = async () => {
    try {
      // Query to filter fuel requests by email
      const requestsQuery = query(
        collection(firestore, 'FuelRequests'),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(requestsQuery);
      const fetchedRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Error fetching fuel requests: ', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing state
    }
  };

  // Fetch fuel requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []); // Dependency array is empty, so it runs only once on mount

  // Render individual fuel request item
  const renderRequestItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.requestDetails}>Reason: {item.reason}</Text>
      <Text style={styles.email}>Email: {item.email}</Text>

      <Text style={styles.amount}>Fuel Amount: {item.requestVolume}L</Text>
      <Text style={styles.timestamp}>
  {item.requestedAt?.toDate().toLocaleString()}
</Text>
    </View>
  );

  // Handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequestItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No fuel requests found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestDetails: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});
