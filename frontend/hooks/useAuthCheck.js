// hooks/useAuthCheck.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';
import { loginSuccess, hydrateAuth, logout } from '../store/authSlice';

export default function useAuthCheck() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        
        if (!token) {
          dispatch(hydrateAuth());
          return;
        }

        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          await SecureStore.deleteItemAsync('token');
          dispatch(logout());
          dispatch(hydrateAuth());
          return;
        }

        dispatch(loginSuccess({ token }));
        dispatch(hydrateAuth());
        
      } catch (error) {
        dispatch(hydrateAuth());
      }
    };

    checkAuth();
  }, [dispatch]);
}