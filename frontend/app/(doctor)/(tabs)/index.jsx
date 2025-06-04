import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen() {
  const { user, isHydrated } = useSelector((state) => state.doctorAuth);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState([]);
  const [patientNotifications, setPatientNotifications] = useState([]);
  const [healthTip, setHealthTip] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await SecureStore.getItemAsync("doctorToken");
        if (!token) {
          console.error("No token found for doctor");
          return;
        }

        // Fetch stats
        const statsResponse = await axiosInstance.get("/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(statsResponse.data);

        // Fetch patient notifications
        const notificationsResponse = await axiosInstance.get(
          "/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatientNotifications(notificationsResponse.data);

        // Fetch health tip
        const healthTipResponse = await axiosInstance.get("/api/health-tip", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHealthTip(healthTipResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await SecureStore.getItemAsync("doctorToken");
        if (!token) {
          console.error("No token found for doctor");
          return;
        }

        const response = await axiosInstance.get("/api/appointments/doctor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUpcomingAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  if (!isHydrated) return null;
  if (!user) {
    return <Text>Please Login</Text>;
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Good Morning, {user.name}</Text>
            <Text style={styles.specialization}>
              Specialization: {user.specialization}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <FlatList
            data={stats}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>{item.title}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            )}
            contentContainerStyle={styles.statsList}
          />
        </View>

        {/* Upcoming Appointments */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <View style={styles.appointmentsList}>
          {upcomingAppointments.map((item) => (
            <TouchableOpacity key={item._id} style={styles.appointmentItem}>
              <Text style={styles.appointmentPatient}>{item.userId.name}</Text>
              <Text style={styles.appointmentDetails}>
                {new Date(item.date).toLocaleDateString()} -{" "}
                {new Date(item.date).toLocaleTimeString()}
              </Text>
              {/* Add the reason for the appointment in the display */}
              <Text style={styles.appointmentDetails}>Reason: {item.reason}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Patient Notifications */}
        <Text style={styles.sectionTitle}>Patient Notifications</Text>
        <View style={styles.notificationsList}>
          {patientNotifications.map((item) => (
            <TouchableOpacity key={item.id} style={styles.notificationItem}>
              <Text style={styles.notificationText}>{item.message}</Text>
              <Text style={styles.notificationDetails}>Date: {new Date().toLocaleDateString()}</Text>
              <Text style={styles.notificationDetails}>Time: {new Date().toLocaleTimeString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Tip Section */}
        <View style={styles.healthTipContainer}>
          <Text style={styles.healthTipText}>{healthTip}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  specialization: {
    fontSize: 14,
    color: "#E3E3E3",
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsList: {
    paddingLeft: 0,
  },
  statCard: {
    backgroundColor: "#4A90E2",
    padding: 20,
    borderRadius: 10,
    marginRight: 16,
    minWidth: 120,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    color: "#fff",
    fontSize: 14,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  appointmentItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentPatient: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  appointmentDetails: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  appointmentsList: {
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
  notificationDetails: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  notificationsList: {
    marginBottom: 20,
  },
  healthTipContainer: {
    backgroundColor: "#FFFAF0",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  healthTipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
