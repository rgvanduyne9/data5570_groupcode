import { createSlice } from '@reduxjs/toolkit';

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    utahState: [], // Array of game objects with date, opponent, and time
  },
  reducers: {
    setGames: (state, action) => {
      const { school, games } = action.payload;
      state[school] = games;
    },
  },
});

export const { setGames } = gamesSlice.actions;
export default gamesSlice.reducer;