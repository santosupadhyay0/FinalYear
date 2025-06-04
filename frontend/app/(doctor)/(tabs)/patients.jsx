import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axiosInstance from '@/utils/axiosInstance';
import * as SecureStore from 'expo-secure-store';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedAppointments = async () => {
      try {
        const token = await SecureStore.getItemAsync('doctorToken');
        if (!token) {
          console.error('No token found for doctor');
          Alert.alert('Error', 'You must be logged in to view patients.');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get('/api/appointments/doctor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const confirmedPatients = response.data.filter(
          (appointment) => appointment.status === 'confirmed'
        ).map((appointment) => ({
          id: appointment._id,
          name: appointment.userId.name,
          reason: appointment.reason,
          date: new Date(appointment.date).toLocaleString(),
        }));

        setPatients(confirmedPatients);
      } catch (error) {
        console.error('Error fetching confirmed appointments:', error);
        Alert.alert('Error', 'Failed to fetch patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedAppointments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading patients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {patients.length === 0 ? (
        <Text style={styles.noPatients}>No patients available</Text>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.patientItem}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientReason}>Reason: {item.reason}</Text>
              <Text style={styles.patientDate}>Date: {item.date}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  noPatients: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
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
  patientReason: {
    fontSize: 14,
    color: '#6b7280',
    marginVertical: 4,
  },
  patientDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
