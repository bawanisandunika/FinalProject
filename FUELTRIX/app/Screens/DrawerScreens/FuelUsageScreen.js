import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export default function FuelUsageScreen() {
  // Example data for fuel usage (in liters)
  const usedFuel = 30;
  const remainingFuel = 70;
  const totalFuel = usedFuel + remainingFuel;

  const data = [
    {
      name: 'Used Fuel',
      fuel: usedFuel,
      color: '#030E25', // Dark blue color for used fuel
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Remaining Fuel',
      fuel: remainingFuel,
      color: '#888', // Grey color for remaining fuel
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  // Example vehicle fueling history data
  const vehicleHistory = [
    { date: '2024-10-01', vehicle: 'Toyota Prius', fuelVolume: '50L', location: 'Shell Station' },
    { date: '2024-09-25', vehicle: 'Ford F-150', fuelVolume: '70L', location: 'BP Fuel' },
    { date: '2024-09-18', vehicle: 'Honda Accord', fuelVolume: '40L', location: 'Chevron' },
    { date: '2024-09-10', vehicle: 'Tesla Model X', fuelVolume: '60L', location: 'Supercharger' },
  ];

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Current Vehicle Fuel Usage</Text>

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
          <Text style={styles.detailsText}>Total Fuel: {totalFuel} liters</Text>
          <Text style={styles.detailsText}>Used Fuel: {usedFuel} liters</Text>
          <Text style={styles.detailsText}>Remaining Fuel: {remainingFuel} liters</Text>
        </View>

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
