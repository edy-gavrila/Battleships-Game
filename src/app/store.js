import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/gameState/gameStateSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
