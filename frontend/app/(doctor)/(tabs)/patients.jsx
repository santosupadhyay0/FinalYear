import { View, Text, StyleSheet, FlatList } from 'react-native';

const patients = [
  { id: '1', name: 'John Doe', condition: 'Hypertension', lastVisit: '2023-05-10' },
  { id: '2', name: 'Jane Smith', condition: 'Pregnancy', lastVisit: '2023-04-20' },
  { id: '3', name: 'Emily Clark', condition: 'Diabetes', lastVisit: '2023-02-11' },
];

export default function Patients() {
  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.patientItem}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientCondition}>{item.condition}</Text>
            <Text style={styles.patientLastVisit}>Last Visit: {item.lastVisit}</Text>
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
  patientItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  patientCondition: {
    fontSize: 14,
    color: '#6b7280',
    marginVertical: 4,
  },
  patientLastVisit: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
