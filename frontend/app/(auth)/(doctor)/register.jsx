import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import colors from '@/constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/redux/slices/authSlice';

export default function DoctorRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [age, setAge] = useState('')

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state)=>state.auth)

  const handleRegister = async () => {
    if (!name || !email || !password){
      Alert.alert('Enter all the credentials')
      return
    }
    try {
      const result = await dispatch(registerUser({name, email, password, age, specialization}))
      if(registerUser.fulfilled.match(result)){
        Alert.alert('Success', 'Registered Successfully')
        router.push('/(auth)/(doctor)/login')
      }else{
        Alert.alert('Registration Failed', result.payload || 'Something went wrong')
      }
    } catch (error) {
      Alert.alert('Error', 'Could not register')
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Doctor Registration</Text>
      <Text style={styles.subtitle}>Verify your medical credentials</Text>

      {/* Form */}
      <View style={styles.form}>
      <TextInput
          placeholder="Doctor Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      <TextInput
          placeholder="Specialization"
          value={specialization}
          onChangeText={setSpecialization}
          style={styles.input}
        />
      <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          style={styles.input}
        />
        <TextInput
          placeholder="Doctor Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize='none'
        />
        <TextInput
          placeholder="Create Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator />
        ): (
          <Pressable style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Complete Registration</Text>
          </Pressable>
        )}
       

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered? </Text>
          <Link href="/(auth)/(doctor)/login" style={styles.footerLink}>
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
}

// Reuse the same styles from login.js
const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 24,
      backgroundColor: colors.white,
      justifyContent: 'center',
    },
    logo: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.doctor,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
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
      alignItems: 'center',
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
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    footerText: {
      color: colors.gray,
      fontSize: 15,
    },
    footerLink: {
      color: colors.doctor,
      fontWeight: '600',
      fontSize: 15,
    },
});