import { configureStore } from "@reduxjs/toolkit";
import aiToolSlice from "../slices/aiTool";
import userSlice from "../slices/user";

const store = configureStore({
  reducer: {
    aiTool: aiToolSlice,
    user: userSlice,
  },
});

export default store;
