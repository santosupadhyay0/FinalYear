import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axiosInstance from "@/utils/axiosInstance";
import * as SecureStore from "expo-secure-store";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await SecureStore.getItemAsync("doctorToken");
        if (!token) {
          console.error("No token found for doctor");
          Alert.alert("Error", "You must be logged in to view appointments.");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get("/api/appointments/doctor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        Alert.alert("Error", "Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const token = await SecureStore.getItemAsync("doctorToken");
      if (!token) {
        console.error("No token found for doctor");
        Alert.alert("Error", "You must be logged in to update appointment status.");
        return;
      }

      await axiosInstance.patch(
        `/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", `Appointment ${newStatus} successfully!`);

      // Remove the appointment from the list
      const updatedAppointments = appointments.filter(
        (appointment) => appointment._id !== appointmentId
      );
      setAppointments(updatedAppointments);

      // Navigate to patients page if confirmed
      if (newStatus === "confirmed") {
        router.push("/(doctor)/(tabs)/patients");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      Alert.alert("Error", "Failed to update appointment status.");
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.patientName}>Patient: {item.userId.name}</Text>
      <Text style={styles.details}>Reason: {item.reason}</Text>
      <Text style={styles.details}>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateStatus(item._id, "confirmed")}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateStatus(item._id, "cancelled")}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {appointments.length === 0 ? (
        <Text style={styles.noAppointments}>No appointments available</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointment}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
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
  patientName: {
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});