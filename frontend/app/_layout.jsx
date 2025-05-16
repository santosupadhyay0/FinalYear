import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import store from '@/redux/store'; // ✅ Your redux store
import { loadUser } from '@/redux/slices/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function InnerApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
  );
}
