// src/store/unitSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchUnits = createAsyncThunk("unit/fetchUnits", async (params = {}, { rejectWithValue }) => {
  try {
    const query = params.query ? `?search=${params.query}` : "";
    const res = await axiosClient.get(`/unit${query}`);
    return res.data.data;
  } catch (err) {
    console.log(err);   
    return rejectWithValue(err.response?.data?.message || "Failed to load units");
  }
});

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default unitSlice.reducer;
