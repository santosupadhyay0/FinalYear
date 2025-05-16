import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";

const stats = [
  { id: "1", title: "Total Patients", value: 200 },
  { id: "2", title: "Scheduled Appointments", value: 10 },
  { id: "3", title: "Messages", value: 3 },
];

const upcomingAppointments = [
  { id: "1", patient: "John Doe", date: "2023-05-12", time: "10:00 AM" },
  { id: "2", patient: "Jane Smith", date: "2023-05-14", time: "2:00 PM" },
  { id: "3", patient: "Emily Clark", date: "2023-05-15", time: "11:30 AM" },
];

const patientNotifications = [
  {
    id: "1",
    message: "Patient John Doe requested an appointment for 2023-05-12.",
  },
  {
    id: "2",
    message: "Patient Jane Smith has completed the latest health check.",
  },
  { id: "3", message: "Patient Emily Clark needs a follow-up consultation." },
];

const healthTip =
  "Remember to encourage your patients to stay hydrated, especially in warmer weather!";

export default function HomeScreen() {
  
  const { user, isHydrated } = useSelector((state) => state.auth);

  if (!isHydrated) return null;
  // console.log(user)
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Good Morning,{user.name} </Text>
            <Text style={styles.specialization}>
              Specialization:{user.specialization}
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
            <TouchableOpacity key={item.id} style={styles.appointmentItem}>
              <Text style={styles.appointmentPatient}>{item.patient}</Text>
              <Text style={styles.appointmentDetails}>
                {item.date} - {item.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Patient Notifications */}
        <Text style={styles.sectionTitle}>Patient Notifications</Text>
        <View style={styles.notificationsList}>
          {patientNotifications.map((item) => (
            <TouchableOpacity key={item.id} style={styles.notificationItem}>
              <Text style={styles.notificationText}>{item.message}</Text>
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
