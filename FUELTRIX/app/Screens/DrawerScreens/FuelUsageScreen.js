import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

export default function FuelUsageScreen() {
  const driverData = useSelector((state) => state.driver.driverData);
  const { email, registrationNumber, status } = driverData;

  const [fuelData, setFuelData] = useState({
    fuelVolume: 0,
    pumpedVolume: 0,
    requestedVolume: 0,
  });

  const [pumpHistory, setPumpHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFuelData = async () => {
    if (status && registrationNumber) {
      try {
        const q = query(
          collection(firestore, 'Vehicle'),
          where('registrationNumber', '==', registrationNumber)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setFuelData({
            fuelVolume: data.fuelVolume || 0,
            pumpedVolume: data.pumpedVolume || 0,
            requestedVolume: data.requestedVolume || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching fuel data: ', error);
      }
    }
  };

  const fetchPumpHistory = async () => {
    try {
      const q = query(
        collection(firestore, 'Pump'),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);

      const pumpData = querySnapshot.docs.map((doc) => doc.data());
      setPumpHistory(pumpData);
    } catch (error) {
      console.error('Error fetching pump history: ', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchFuelData(), fetchPumpHistory()]);
    setRefreshing(false);
  }, [registrationNumber, status, email]);

  useEffect(() => {
    fetchFuelData();
    fetchPumpHistory();
  }, [registrationNumber, status, email]);

  const finalFuelVolume = fuelData.fuelVolume + fuelData.requestedVolume;
  const finalAllfuelVolume = finalFuelVolume - fuelData.pumpedVolume;

  const data = [
    {
      name: 'L',
      fuel: status === false ? 0 : finalAllfuelVolume,
      color: '#030E25',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'L',
      fuel: status === false ? 0 : fuelData.pumpedVolume,
      color: '#888',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const formatPumpTime = (pumpTime) => {
    if (!pumpTime) return 'N/A';

    const date = new Date(pumpTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Current Vehicle Fuel Usage</Text>

        {status === false ? (
          <Text style={styles.linkText}>Please link to a vehicle</Text>
        ) : (
          <>
            <PieChart
              data={data}
              width={Dimensions.get('window').width - 50}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="fuel"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>
                Fuel Volume: {finalFuelVolume} liters
              </Text>
              <Text style={styles.detailsText}>
                Pumped Volume: {fuelData.pumpedVolume} liters
              </Text>
              <Text style={styles.detailsText}>
                Remaining Volume: {finalAllfuelVolume} liters
              </Text>
            </View>
          </>
        )}

        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Pump History</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Vehicle Number</Text>
              <Text style={styles.tableHeaderText}>Fuel Volume</Text>
              <Text style={styles.tableHeaderText}>Fuel Type</Text>
              <Text style={styles.tableHeaderText}>Time</Text>
              <Text style={styles.tableHeaderText}>Shed</Text>
            </View>

            {pumpHistory.map((record, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {record.vehicleNumber || 'N/A'}
                </Text>
                <Text style={styles.tableCell}>
                  {record.fuelPumped || 'N/A'}L
                </Text>
                <Text style={styles.tableCell}>{record.fuelType || 'N/A'}</Text>
                <Text style={styles.tableCell}>
                  {formatPumpTime(record.pumpTime)}
                </Text>
                <Text style={styles.tableCell}>
                  {record.shedName || 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Google-Bold',
    marginBottom: 20,
    color: '#030E25',
  },
  linkText: {
    fontSize: 16,
    color: '#ff6347',
    fontFamily: 'Google-Bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  detailsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Google-Bold',
  },
  tableContainer: {
    marginTop: 40,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: 'Google-Bold',
    color: '#030E25',
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Google-Bold',
    textAlign: 'center',
    color: '#030E25',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Google',
  },
});







 