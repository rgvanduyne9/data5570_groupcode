import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  utahState: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  utep: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  texasAM: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  airForce: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  mcneeseState: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  vanderbilt: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  hawaii: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  'sanJoséState': {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  newMexico: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  nevada: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  unlv: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  fresnoState: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  },
  boiseState: {
    offense: Array(17).fill(false),
    defense: Array(17).fill(false),
    kicks: Array(17).fill(false),
    resolvedOffense: Array(17).fill(false),
    resolvedDefense: Array(17).fill(false),
    resolvedKicks: Array(17).fill(false),
    tvOffense: Array(17).fill(false),
    tvDefense: Array(17).fill(false),
    tvKicks: Array(17).fill(false),
  }
};

export const checkboxSlice = createSlice({
  name: 'checkboxes',
  initialState,
  reducers: {
    updateCheckbox: (state, action) => {
      const { school, category, index, value } = action.payload;
      state[school][category][index] = value;
    },
  },
});

export const { updateCheckbox } = checkboxSlice.actions;
export default checkboxSlice.reducer; 