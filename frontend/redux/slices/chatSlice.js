import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/chat'

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async({ senderId, receiverId, message }, thunkAPI ) => {
        try {
            const res = await axios.post(`${API_URL}/send`, {
                senderId,
                receiverId,
                message
            })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send the message')
        }
    })


export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async({ senderId, receiverId, message }, thunkAPI ) => {
        try {
            const res = await axios.post(`${API_URL}/conversation`, {
                params: { senderId, receiverId },
            })
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch the messages')
        }
    })


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        loading: false,
        error: null
    },
    reducers: {
        clearMessages: (state) => {
            state.messages = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages.push(action.payload)
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(fetchMessages.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearMessages } = chatSlice.actions
export default chatSlice.reducer