import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

export default function ReviewComplain() {
  const [complaints, setComplaints] = useState([]); // State to store complaints
  const [loading, setLoading] = useState(true); // Loading indicator for initial fetch
  const [refreshing, setRefreshing] = useState(false); // Refreshing indicator

  // Fetch complaints from Firestore
  const fetchComplaints = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'Complain'));
      const fetchedComplaints = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Add Firestore document ID
        ...doc.data(), // Spread the rest of the document data
      }));
      setComplaints(fetchedComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing state
    }
  };

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Render individual complaint item
  const renderComplaintItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.driverName}>{item.driverName}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.registrationNumber}>Reg No: {item.registrationNumber}</Text>
      <Text style={styles.complaintText}>{item.complain}</Text>
      <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  // Handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaintItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No complaints found.</Text>
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
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  registrationNumber: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  complaintText: {
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
