import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/utils/axiosInstance";
import { LinearGradient } from "expo-linear-gradient";
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function BookAppointmentScreen() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorItems, setDoctorItems] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get("/api/doctors/all");
        const items = res.data.map((doc) => ({
          label: `${doc.name} - ${doc.specialization}`,
          value: doc._id,
        }));
        setDoctorItems(items);
      } catch (err) {
        console.error("Doctor fetch error:", err);
      }
    };

    fetchDoctors();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !reason) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("patientToken"); // Retrieve token
      console.log("Retrieved token:", token); // Debug log
      if (!token) {
        Alert.alert("Error", "You must be logged in to book an appointment.");
        return;
      }

      await axiosInstance.post(
        "/api/appointments/",
        {
          doctorId: selectedDoctor,
          date: date.toISOString(),
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      Alert.alert("Success", "Appointment booked successfully!");
      setSelectedDoctor("");
      setDate(new Date());
      setReason("");
      router.push('/screen/AppointmentList'); // Navigate to appointment list
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Text style={styles.heading}>🩺 Book an Appointment</Text>

        <View style={styles.card}>
          {/* Doctor Picker */}
          <Text style={styles.label}>
            <MaterialIcons name="person" size={18} /> Select Doctor
          </Text>
          <View style={styles.pickerWrapper}>
            <DropDownPicker
              open={open}
              value={selectedDoctor}
              items={doctorItems}
              setOpen={setOpen}
              setValue={setSelectedDoctor}
              setItems={setDoctorItems}
              placeholder="Select a doctor"
              style={{
                borderColor: "#4ade80",
                backgroundColor: "#f0fdf4",
                borderRadius: 10,
              }}
              dropDownContainerStyle={{
                borderColor: "#4ade80",
              }}
              zIndex={1000}
              zIndexInverse={1000}
            />
          </View>

          {/* Date and Time */}
          <Text style={styles.label}>
            <Ionicons name="calendar" size={18} /> Choose Date & Time
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>{date.toLocaleString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={onChangeDate}
            />
          )}

          {/* Reason */}
          <Text style={styles.label}>
            <FontAwesome name="pencil" size={18} /> Reason for Visit
          </Text>
          <TextInput
            placeholder="Write your reason here..."
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            style={styles.textArea}
          />

          {/* Confirm Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <LinearGradient
              colors={["#4f46e5", "#6366f1"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>✅ Confirm Appointment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f7",
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    marginTop: 12,
  },
  pickerWrapper: {
    zIndex: 1000, // necessary for DropDownPicker to avoid overlap
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: "#e2e8f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#1e293b",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backButton: {
    padding: 10,
    alignItems: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#4f46e5",
  },
});
