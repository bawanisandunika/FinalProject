import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

export default function ReviewRequest() {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch requests from Firestore
  const fetchRequests = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'FuelRequests'));
      const fetchedRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Error fetching fuel requests: ', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Refresh handler for pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const renderCard = ({ item }) => {
    const cardColor = item.approvedStatus === 'pending' ? styles.pendingCard : styles.approvedCard;

    return (
      <TouchableOpacity style={[styles.card, cardColor]}>
        <Text style={styles.cardTitle}>Vehicle Number: {item.registrationNumber}</Text>
        <Text style={styles.cardText}>Requested By: {item.email}</Text>
        <Text style={styles.cardText}>Volume: {item.requestVolume} Liters</Text>
        <Text style={styles.cardText}>Reason: {item.reason}</Text>
        <Text style={styles.cardText}>Status: {item.approvedStatus}</Text>
        <Text style={styles.cardText}>Requested At: {item.requestedAt?.toDate().toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing} // Bind refreshing state
        onRefresh={handleRefresh} // Bind refresh handler
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pendingCard: {
    backgroundColor: '#ffcccc', // Light red for pending status
  },
  approvedCard: {
    backgroundColor: '#ccffcc', // Light green for approved status
  },
  cardTitle: {
    fontSize: 18,
    color: '#030E25',
    marginBottom: 5,
    fontFamily: 'Google-Bold',
  },
  cardText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
    fontFamily: 'Google',
  },
});
