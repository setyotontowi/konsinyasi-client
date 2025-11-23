import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

// ----- THUNKS -----

export const fetchUsedBarang = createAsyncThunk(
  "purchase/fetchUsedBarang",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/purchase/used-items", {
        params: { page, limit },
      });
      return res.data; // { status, message, pagination, data }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPurchaseOrders = createAsyncThunk(
  "purchase/fetchPurchaseOrders",
  async ({ page = 1, limit = 20, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      // you can extend this later for real filters
      if (filters.cetak) params.append("cetak", filters.cetak);
      if (filters.id_master_unit_supplier)
        params.append("id_master_unit_supplier", filters.id_master_unit_supplier);

      const res = await axiosClient.get(`/purchase?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- SLICE -----

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    used: {
      list: [],
      pagination: { page: 1, totalPages: 1, totalItems: 0 },
      loading: false,
      error: null,
    },
    purchaseOrders: {
      list: [],
      pagination: { page: 1, totalPages: 1, totalItems: 0 },
      loading: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // used barang
      .addCase(fetchUsedBarang.pending, (state) => {
        state.used.loading = true;
        state.used.error = null;
      })
      .addCase(fetchUsedBarang.fulfilled, (state, action) => {
        state.used.loading = false;
        state.used.list = action.payload.data || [];
        const p = action.payload.pagination || {};
        state.used.pagination = {
          page: p.page || 1,
          totalPages: p.total_pages || 1,
          totalItems: p.total || 0,
        };
      })
      .addCase(fetchUsedBarang.rejected, (state, action) => {
        state.used.loading = false;
        state.used.error = action.payload;
      })

      // purchase orders
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.purchaseOrders.loading = true;
        state.purchaseOrders.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.purchaseOrders.loading = false;
        state.purchaseOrders.list = action.payload.data || [];
        const p = action.payload.pagination || {};
        state.purchaseOrders.pagination = {
          page: p.page || 1,
          totalPages: p.total_pages || 1,
          totalItems: p.total || 0,
        };
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.purchaseOrders.loading = false;
        state.purchaseOrders.error = action.payload;
      });
  },
});

export default purchaseSlice.reducer;
