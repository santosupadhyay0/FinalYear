import { Stack } from 'expo-router'

export default function PatientHomeLayout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='(tabs)' />
    </Stack>
  )
}