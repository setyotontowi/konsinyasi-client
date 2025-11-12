import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// Fetch journal logs
export const fetchJournal = createAsyncThunk(
  "journal/fetch",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/inventory/journal?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const journalSlice = createSlice({
  name: "journal",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournal.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default journalSlice.reducer;
