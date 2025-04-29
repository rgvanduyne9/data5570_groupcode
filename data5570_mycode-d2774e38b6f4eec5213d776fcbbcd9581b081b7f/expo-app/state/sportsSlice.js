import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base API URL
const API_URL = 'http://localhost:8000/api/games/';

// Thunk for fetching sports data
export const fetchSportsData = createAsyncThunk(
  'sports/fetchSportsData',
  async (school) => {
    console.log('Fetching all sports data');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ school: 'all' }), // Always fetch all games
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch sports data');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchSportsData:', error);
      throw error;
    }
  }
);

// Initial State
const initialState = {
  sportsData: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Redux Slice
const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    resetState: (state) => {
      // Only reset status and error, keep the data
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSportsData.pending, (state) => {
        console.log('Fetch pending');
        state.status = 'loading';
      })
      .addCase(fetchSportsData.fulfilled, (state, action) => {
        console.log('Fetch succeeded, data:', action.payload);
        state.status = 'succeeded';
        state.sportsData = action.payload;
      })
      .addCase(fetchSportsData.rejected, (state, action) => {
        console.log('Fetch failed:', action.error);
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default sportsSlice.reducer; 