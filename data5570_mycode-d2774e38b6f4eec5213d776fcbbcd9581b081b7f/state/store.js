import { configureStore } from '@reduxjs/toolkit';
import checkboxReducer from './checkboxSlice';
import gameNotesReducer from './gameNotesSlice';
import gamesReducer from './gamesSlice';
import sportsReducer from './sportsSlice';

export const store = configureStore({
  reducer: {
    checkboxes: checkboxReducer,
    gameNotes: gameNotesReducer,
    games: gamesReducer,
    sports: sportsReducer,
  },
}); 