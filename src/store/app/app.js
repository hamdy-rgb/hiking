import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import sasTokenSlice from "../features/sasTokenSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sasToken: sasTokenSlice,
  },
});

export default store;
