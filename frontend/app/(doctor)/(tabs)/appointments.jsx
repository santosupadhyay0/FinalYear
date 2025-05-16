import { View, Text, StyleSheet, FlatList } from 'react-native';

const appointments = [
  { id: '1', patient: 'John Doe', date: '2023-05-12', time: '10:00 AM' },
  { id: '2', patient: 'Jane Smith', date: '2023-05-14', time: '2:00 PM' },
  { id: '3', patient: 'Emily Clark', date: '2023-05-15', time: '11:30 AM' },
];

export default function Appointments() {
  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text style={styles.appointmentPatient}>{item.patient}</Text>
            <Text style={styles.appointmentDate}>{item.date}</Text>
            <Text style={styles.appointmentTime}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentPatient: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#6b7280',
    marginVertical: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
