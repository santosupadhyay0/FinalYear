import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { registerDoctor } from "@/redux/slices/doctorAuthSlice";
import { registerPatient } from "@/redux/slices/patientAuthSlice";

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [userType, setUserType] = useState("patient");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  // Doctor-specific
  const [specialization, setSpecialization] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [levelOfStudy, setLevelOfStudy] = useState("");
  const [workplace, setWorkplace] = useState("");

  // Patient-specific
  const [spouse, setSpouse] = useState("");

  // Get states from slices
  const doctorAuth = useSelector((state) => state.doctorAuth);
  const patientAuth = useSelector((state) => state.patientAuth);

  const {
    loading: doctorLoading,
    error: doctorError,
    user: doctorUser,
  } = doctorAuth;

  const {
    loading: patientLoading,
    error: patientError,
    user: patientUser,
  } = patientAuth;

  // Handle success
  useEffect(() => {
    if (userType === "doctor" && doctorUser) {
      Alert.alert("Success", "Doctor registered successfully!");
      router.push("/(auth)/login");
    } else if (userType === "patient" && patientUser) {
      Alert.alert("Success", "Patient registered successfully!");
      router.push("/(auth)/login");
    }
  }, [doctorUser, patientUser]); // Removed userType dependency to avoid unnecessary re-renders

  // Handle error
  useEffect(() => {
    if (userType === "doctor" && doctorError) {
      Alert.alert("Doctor Registration Failed", doctorError);
    } else if (userType === "patient" && patientError) {
      Alert.alert("Patient Registration Failed", patientError);
    }
  }, [doctorError, patientError]); // No changes needed here

  // Add debug logs to track the loading state in the component
  useEffect(() => {
    console.log("RegisterScreen: doctorLoading =", doctorLoading);
    console.log("RegisterScreen: patientLoading =", patientLoading);
  }, [doctorLoading, patientLoading]);
 // Prevent overlapping dispatches by checking the loading state
  const handleRegister = () => {
    if (doctorAuth.loading || patientAuth.loading) {
      console.log("Register action prevented: another action is already in progress.");
      return;
    }

    if (userType === "doctor") {
      dispatch(
        registerDoctor({
          name,
          email,
          password,
          age,
          specialization,
          doctorValidationId: doctorId,
          levelOfStudy,
          workplace,
        })
      );
    } else {
      dispatch(
        registerPatient({
          name,
          email,
          password,
          age,
          spouse,
        })
      );
    }
  };
  const goToLogin = () => {
    router.push({
      pathname: "/login",
      params: { userType },
    });
  };

  const loading = userType === "doctor" ? doctorLoading : patientLoading;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "patient" && styles.activeToggle,
            ]}
            onPress={() => setUserType("patient")}
          >
            <Text
              style={[
                styles.toggleText,
                userType === "patient" && styles.activeToggleText,
              ]}
            >
              Patient
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userType === "doctor" && styles.activeToggle,
            ]}
            onPress={() => setUserType("doctor")}
          >
            <Text
              style={[
                styles.toggleText,
                userType === "doctor" && styles.activeToggleText,
              ]}
            >
              Doctor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Common fields */}
        <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} autoCapitalize="words" />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput placeholder="Age" style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

        {/* Doctor specific fields */}
        {userType === "doctor" && (
          <>
            <TextInput placeholder="Specialization" style={styles.input} value={specialization} onChangeText={setSpecialization} />
            <TextInput placeholder="Doctor Validation ID" style={styles.input} value={doctorId} onChangeText={setDoctorId} />
            <TextInput placeholder="Level of Study" style={styles.input} value={levelOfStudy} onChangeText={setLevelOfStudy} />
            <TextInput placeholder="Workplace" style={styles.input} value={workplace} onChangeText={setWorkplace} />
          </>
        )}

        {/* Patient specific field */}
        {userType === "patient" && (
          <TextInput placeholder="Spouse" style={styles.input} value={spouse} onChangeText={setSpouse} />
        )}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? "Registering..." : `Register as ${userType}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToLogin} style={{ marginTop: 20 }}>
                <Text style={{ color: "blue", textAlign: "center" }}>
                  Already have an account? Login as a {userType}
                </Text>
              </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
    borderRadius: 25,
  },
  activeToggle: {
    backgroundColor: "#4A90E2",
  },
  toggleText: {
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  activeToggleText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
