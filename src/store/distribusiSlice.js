import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchDistribusi = createAsyncThunk(
  "distribusi/fetch",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/distribusi/distribusi?page=${page}&limit=${limit}`);

      // Modify each item in the data array to include pd_id
      const modifiedData = res.data.data.map((item) => ({
        ...item,
        pd_id: item.id_permintaan_distribusi, // append new key
      }));

      // Return the same structure, but with modified data
      const response = {
        ...res.data,
        data: modifiedData,
      };

      console.log(response);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const distribusiSlice = createSlice({
  name: "distribusi",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistribusi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistribusi.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        const p = action.payload.pagination || {};
        state.pagination = {
          page: p.page || 1,
          totalPages: p.total_pages || 1,
          totalItems: p.total || 0,
        };
      })
      .addCase(fetchDistribusi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default distribusiSlice.reducer;
