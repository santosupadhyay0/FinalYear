import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity, 
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import colors from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Enter the credentials");
      return;
    }
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        router.replace("/(doctor)");
      } else {
        console.log(result)
        Alert.alert("Login Failed", result.payload || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <Image
        source={require("@/assets/images/pregnant.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Doctor Login</Text>
      <Text style={styles.subtitle}>Access your medical dashboard</Text>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
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
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to MaatriSahara? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/(doctor)/register")}
            style={styles.footerLink}
          >
            <Text>Register Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.doctor,
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
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.doctor,
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: colors.gray,
    fontSize: 15,
  },
  footerLink: {
    color: colors.doctor,
    fontWeight: "600",
    fontSize: 15,
  },
});
