import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice";
import unitReducer from "../store/unitSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    unit: unitReducer
  },
});


export default store;