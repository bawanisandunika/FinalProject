import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

export default function FuelUsageScreen() {
  const driverData = useSelector((state) => state.driver.driverData);
  const { email, registrationNumber, status } = driverData;
 console.log(status)
  const [fuelData, setFuelData] = useState({
    fuelVolume: 0,
    pumpedVolume: 0,
    requestedVolume: 0,
  });

  // Fetch data from Firebase
  useEffect(() => {
    const fetchFuelData = async () => {
      if (status && registrationNumber) {
        try {
          const q = query(
            collection(firestore, 'Vehicle'), 
            where('registrationNumber', '==', registrationNumber)
          );
          const querySnapshot = await getDocs(q);
    
          console.log("Query Snapshot: ", querySnapshot.docs.map(doc => doc.data()));
    
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setFuelData({
              fuelVolume: data.fuelVolume || 0,
              pumpedVolume: data.pumpedVolume || 0,
              requestedVolume: data.requestedVolume || 0,
            });
          }
        } catch (error) {
          console.error("Error fetching fuel data: ", error);
        }
      }
    };
    

    fetchFuelData();
  }, [registrationNumber, status]);


  const vehicleHistory = [
    { date: '2024-10-01', vehicle: 'Toyota Prius', fuelVolume: '50L', location: 'Shell Station' },
    { date: '2024-09-25', vehicle: 'Ford F-150', fuelVolume: '70L', location: 'BP Fuel' },
    { date: '2024-09-18', vehicle: 'Honda Accord', fuelVolume: '40L', location: 'Chevron' },
    { date: '2024-09-10', vehicle: 'Tesla Model X', fuelVolume: '60L', location: 'Supercharger' },
  ];

  finalFuelVolume=fuelData.fuelVolume+fuelData.requestedVolume
  finalAllfuelVolume=finalFuelVolume-fuelData.pumpedVolume
  // Data for the pie chart
  const data = [
    {
      name: 'L',
      fuel: status === false ? 0 : finalAllfuelVolume,
      color: '#030E25', // Dark blue color for fuel volume
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'L',
      fuel: status === false ? 0 : fuelData.pumpedVolume,
      color: '#888', // Grey color for pumped volume
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
   
  ];

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Current Vehicle Fuel Usage</Text>

        {status === false ? (
          <Text style={styles.linkText}>Please link to a vehicle</Text>
        ) : (
          <>
            <PieChart
              data={data}
              width={Dimensions.get('window').width - 50} // Adjust width
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="fuel"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // Show percentage inside the pie slices
            />

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>Fuel Volume: {finalFuelVolume} liters</Text>
              <Text style={styles.detailsText}>Pumped Volume: {fuelData.pumpedVolume} liters</Text>
              <Text style={styles.detailsText}>Remaining Volume: {finalAllfuelVolume} liters</Text>
            </View>
          </>
        )}
          {/* Vehicle Fueling History Table */}
   <View style={styles.tableContainer}>
   <Text style={styles.tableTitle}>Vehicle Fueling History</Text>
   
     <View style={styles.table}>
       <View style={styles.tableHeader}>
         <Text style={styles.tableHeaderText}>Date</Text>
         <Text style={styles.tableHeaderText}>Vehicle</Text>
         <Text style={styles.tableHeaderText}>Fuel Volume</Text>
         <Text style={styles.tableHeaderText}>Location</Text>
       </View>

       {vehicleHistory.map((record, index) => (
         <View key={index} style={styles.tableRow}>
           <Text style={styles.tableCell}>{record.date}</Text>
           <Text style={styles.tableCell}>{record.vehicle}</Text>
           <Text style={styles.tableCell}>{record.fuelVolume}</Text>
           <Text style={styles.tableCell}>{record.location}</Text>
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
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Google',
  },
});







 