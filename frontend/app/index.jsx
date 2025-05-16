import React, { useEffect } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import colors from "../constants/colors";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          source={require("@/assets/images/pregnant.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>MaatriSahara</Text>
        <Text style={styles.subtitle}>Your Pregnancy Care Companion</Text>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.doctorButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/(auth)/(doctor)/login")}
        >
          <Text style={styles.buttonText}>Continue as Doctor</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.patientButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/(auth)/(patient)/login")}
        >
          <Text style={styles.buttonText}>Continue as Patient</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    gap: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  doctorButton: {
    backgroundColor: colors.doctor,
  },
  patientButton: {
    backgroundColor: colors.patient,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
