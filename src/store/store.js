import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice";
import unitReducer from "../store/unitSlice";
import userGroupSlice from "./userGroupSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    unit: unitReducer,
    userGroup: userGroupSlice,
  },
});


export default store;