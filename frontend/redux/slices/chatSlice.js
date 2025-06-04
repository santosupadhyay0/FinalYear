import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chat';

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ senderId, receiverId, message }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/send`, {
        senderId,
        receiverId,
        message,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send the message'
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ senderId, receiverId }, thunkAPI) => {
      try {
        const res = await axios.get(`${API_URL}/${senderId}/${receiverId}`);
        return res.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch the messages');
      }
    }
  );

  export const fetchChatThreads = createAsyncThunk(
    'chat/fetchThreads',
    async (userId, thunkAPI) => {
      try {
        const res = await axios.get(`${API_URL}/threads/${userId}`);
        return res.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
      }
    }
  );
  
  

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    threads: [],
    loading: false,
    error: null,
  },  
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload;
        state.messages.push(message);
      
        // Update or add thread with latest message
        const senderId = message.senderId._id;
        const receiverId = message.receiverId._id;
        const chatKey = [senderId, receiverId].sort().join('_');
      
        // Find thread index
        const index = state.threads.findIndex(t => {
          const tSender = t.senderId._id;
          const tReceiver = t.receiverId._id;
          return [tSender, tReceiver].sort().join('_') === chatKey;
        });
      
        if (index !== -1) {
          state.threads[index] = message; // replace with latest message object
        } else {
          state.threads.unshift(message); // add new thread at front
        }
      })
      
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChatThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      
  },
});

export const { clearMessages, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
