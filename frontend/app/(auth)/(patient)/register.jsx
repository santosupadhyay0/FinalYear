import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert, 
} from "react-native";
import { Link, router } from "expo-router";
import colors from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";

export default function PatientRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
  
    try {
      const resultAction = await dispatch(registerUser({ name, email, password }));
  
      if (registerUser.fulfilled.match(resultAction)) {
        Alert.alert('Success', 'Registered successfully!');
        router.push('/(auth)/(patient)/login'); 
      } else {
        Alert.alert('Registration Failed', resultAction.payload || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not register');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join MaatriSahara for personalized care
      </Text>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleRegister()}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        )}
        {error && <Text style={{color:'red'}}>{error} </Text>}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/(patient)/login" style={styles.footerLink}>
            Login
          </Link>
        </View>
      </View>
    </View>
  );
}

// Reuse the same styles from login.js (or export them from a shared file)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.patient,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    color: colors.gray,
  },
  footerLink: {
    color: colors.patient,
    fontWeight: "600",
  },
});
