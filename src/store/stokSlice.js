// store/stokSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchStok = createAsyncThunk(
  "stok/fetch",
  async (
    {
      page = 1,
      limit = 20,
      search = "",
      id_barang = "",
      ed = "",
      nobatch = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);
      if (id_barang) params.append("id_barang", id_barang);
      if (ed) params.append("ed", ed);
      if (nobatch) params.append("nobatch", nobatch);

      const res = await axiosClient.get(
        `/inventory/get-all-stok?${params.toString()}`
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const stokSlice = createSlice({
  name: "stok",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStok.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStok.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchStok.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stokSlice.reducer;
