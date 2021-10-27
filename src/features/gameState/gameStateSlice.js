import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player1: null,
  player2: null,
  gameState: "",
  nextPlayer: "",
  winner: null,
};

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    updateState: (state, action) => {
      state = action.payload;
    },
  },
});

export const { updateState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
