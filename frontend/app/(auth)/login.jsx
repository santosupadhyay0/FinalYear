import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { loginPatient } from "@/redux/slices/patientAuthSlice"
import { loginDoctor } from "@/redux/slices/doctorAuthSlice"

export default function LoginPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  const [userType, setUserType] = useState(params.userType || "patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redux states for loading and error
  const patientAuth = useSelector((state) => state.patientAuth);
  const doctorAuth = useSelector((state) => state.doctorAuth);

  useEffect(() => {
    if (userType === "patient" && patientAuth.isAuthenticated) {
      router.replace("/(patient)/(tabs)");
    } else if (userType === "doctor" && doctorAuth.isAuthenticated) {
      router.replace("/(doctor)/(tabs)");
    }
  }, [patientAuth.isAuthenticated, doctorAuth.isAuthenticated]); // Removed userType dependency to avoid unnecessary re-renders

  // Update the error handling to avoid showing unnecessary alerts
  useEffect(() => {
    if (userType === "patient" && patientAuth.error) {
      Alert.alert("Login Failed", patientAuth.error);
    } else if (userType === "doctor" && doctorAuth.error) {
      Alert.alert("Login Failed", doctorAuth.error);
    }
  }, [patientAuth.error, doctorAuth.error]); // No changes needed here

  // Add debug logs to track the loading state in the component
  useEffect(() => {
    if (userType === "patient") {
      console.log("LoginPage: patientAuth.loading =", patientAuth.loading);
    } else if (userType === "doctor") {
      console.log("LoginPage: doctorAuth.loading =", doctorAuth.loading);
    }
  }, [userType, patientAuth.loading, doctorAuth.loading]);

  // Prevent overlapping dispatches by checking the loading state
  // Add debug logs to track when handleLogin is called
  const handleLogin = async () => {
    console.log("handleLogin called with email:", email);
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (patientAuth.loading || doctorAuth.loading) {
      console.log("Login action prevented: another action is already in progress.");
      return;
    }

    if (userType === "doctor") {
      dispatch(loginDoctor({ email, password }));
    } else {
      dispatch(loginPatient({ email, password }));
    }
  };

  const goToRegister = () => {
    router.push({
      pathname: "/register",
      params: { userType },
    });
  };

  return (
    <View style={styles.container}>
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

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={
          (userType === "patient" && patientAuth.loading) ||
          (userType === "doctor" && doctorAuth.loading)
        }
      >
        <Text style={styles.loginButtonText}>
          { (userType === "patient" && patientAuth.loading) ||
          (userType === "doctor" && doctorAuth.loading)
            ? "Logging in..."
            : `Login as ${userType}`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue", textAlign: "center" }}>
          Don't have an account? Register as a {userType}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
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
  loginButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
