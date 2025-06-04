import { Slot } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import store from '@/redux/store';
import { useEffect, useState } from 'react';
import { loadDoctor } from '@/redux/slices/doctorAuthSlice';
import { loadPatient } from '@/redux/slices/patientAuthSlice';
import * as SecureStore from 'expo-secure-store';
import socket from '@/utils/socket';

function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const loadUserByRole = async () => {
      try {
        const role = await SecureStore.getItemAsync('role');

        if (role === 'doctor') {
          // Add debug logs to track when loadDoctor is dispatched
          console.log("Dispatching loadDoctor action");
          dispatch(loadDoctor());
        } else if (role === 'patient') {
          dispatch(loadPatient());
        }
      } catch (error) {
        console.error('Failed to load user role:', error);
      } finally {
        setRoleChecked(true); 
      }
    };

    loadUserByRole();
  }, [dispatch]);

  if (!roleChecked) return null; // Don't render anything until the role is checked

  return children;
}

export default function RootLayout() {
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected to socket server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthWrapper>
        <Slot />
      </AuthWrapper>
    </Provider>
  );
}
