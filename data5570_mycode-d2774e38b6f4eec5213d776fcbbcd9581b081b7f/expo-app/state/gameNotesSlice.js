import { createSlice } from '@reduxjs/toolkit';

const gameNotesSlice = createSlice({
  name: 'gameNotes',
  initialState: {
    utahState: {},  // Will store notes by index
    utep: {},
    texasAM: {},
    airForce: {},
    mcneeseState: {},
    vanderbilt: {},
    hawaii: {},
    'sanJoséState': {},
    newMexico: {},
    nevada: {},
    unlv: {},
    fresnoState: {},
    boiseState: {},
  },
  reducers: {
    updateGameNote: (state, action) => {
      const { school, index, note } = action.payload;
      if (!state[school]) {
        state[school] = {};
      }
      state[school][index] = note;
    },
  },
});

export const { updateGameNote } = gameNotesSlice.actions;
export default gameNotesSlice.reducer;