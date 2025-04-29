import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base API URL
const API_URL = 'http://localhost:8000/api/users/';

// Thunks for async operations
export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
});

export const createUser = createAsyncThunk('user/createUser', async (userData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error('Failed to create user');
  return await response.json();
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, updatedData }) => {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return await response.json();
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id) => {
  const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete user');
  return id;
});

// Initial State
const initialState = {
  formDataList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Redux Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formDataList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.formDataList.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.formDataList.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.formDataList[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.formDataList = state.formDataList.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;