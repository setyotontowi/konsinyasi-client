import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// Fetch journal logs
export const fetchJournal = createAsyncThunk(
  "journal/fetch",
  async (
    {
      page = 1,
      limit = 20,
      search = "",
      id_barang = "",
      ed = "",
      nobatch = "",
      start_date = "",
      end_date = "",
    },
    { rejectWithValue }
  ) => {
    try {
      // Build query params dynamically
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);
      if (id_barang) params.append("id_barang", id_barang);
      if (ed) params.append("ed", ed);
      if (nobatch) params.append("nobatch", nobatch);
      if (start_date) params.append("start_date", start_date);
      if (end_date) params.append("end_date", end_date);

      const res = await axiosClient.get(`/inventory/journal?${params.toString()}`);
      return res.data;
    } catch (err) {
      console.log(err)
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
