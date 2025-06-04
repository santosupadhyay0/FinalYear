import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger';
import doctorAuthReducer from '@/redux/slices/doctorAuthSlice'
import patientAuthReducer from '@/redux/slices/patientAuthSlice'
import notificationReducer from '@/redux/slices/notificationSlice'
import chatReducer from '@/redux/slices/chatSlice'

const logger = createLogger({
  collapsed: true,
});

 const store = configureStore ({
    reducer: {
        doctorAuth : doctorAuthReducer,
        patientAuth : patientAuthReducer,
        chat:chatReducer,
        notifications:notificationReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store