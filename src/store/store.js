import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice";
import unitReducer from "../store/unitSlice";
import userGroupSlice from "./userGroupSlice";
import barangReducer from "./barangSlice"
import satuanReducer from "./satuanSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    unit: unitReducer,
    userGroup: userGroupSlice,
    barang : barangReducer,
    satuan: satuanReducer,
  },
});


export default store;