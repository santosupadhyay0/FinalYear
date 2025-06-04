import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/utils/axiosInstance";
import * as SecureStore from "expo-secure-store";

export default function AppointmentList() {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await SecureStore.getItemAsync("patientToken");
        if (!token) {
          console.error("No token found for patient");
          return;
        }

        const response = await axiosInstance.get("/api/appointments/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.doctorName}>Doctor: {item.doctorId.name}</Text>
      <Text style={styles.details}>Reason: {item.reason}</Text>
      <Text style={styles.details}>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {appointments.length === 0 ? (
        <Text style={styles.noAppointments}>No appointments available</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointment}
        />
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2563eb",
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  noAppointments: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  details: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    color: "#2563eb",
    marginTop: 4,
  },
});