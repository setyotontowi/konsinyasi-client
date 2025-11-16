// src/store/barangSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// =====================
// Async Thunks
// =====================

// Fetch Barang
export const fetchBarang = createAsyncThunk(
  "barang/fetchBarang",
  async (
    { page = 1, limit = 20, search = "", filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      // search → maps to backend filter "nama"
      if (search) params.append("nama", search);

      // apply extra filters
      if (filters.satuan) params.append("satuan", filters.satuan);
      if (filters.nama_pabrik) params.append("nama_pabrik", filters.nama_pabrik);

      const res = await axiosClient.get(`barang/items?${params.toString()}`);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add Barang
export const addBarang = createAsyncThunk(
  "barang/addBarang",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("barang/item", payload);
      toast.success("Barang berhasil ditambahkan!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan barang.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Edit Barang
export const editBarang = createAsyncThunk(
  "barang/editBarang",
  async ({ barang_id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`barang/item/${barang_id}`, payload);
      toast.success("Barang berhasil diperbarui!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui barang.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete Barang
export const deleteBarang = createAsyncThunk(
  "barang/deleteBarang",
  async (barang_id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`barang/item/${barang_id}`);
      toast.success("Barang berhasil dihapus!");
      return barang_id;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus barang.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Fetch Satuan (for dropdown)
export const fetchSatuan = createAsyncThunk(
  "barang/fetchSatuan",
  async (nama = "", { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`barang/satuan?nama=${encodeURIComponent(nama)}`);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =====================
// Slice Definition
// =====================
const barangSlice = createSlice({
  name: "barang",
  initialState: {
    list: [],
    satuanList: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,

    modalOpen: false,
    confirmOpen: false,
    mode: "add",
    selectedBarang: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.mode = "add";
      state.selectedBarang = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "edit";
      state.selectedBarang = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.selectedBarang = null;
      state.mode = "add";
    },
    openDeleteConfirm: (state, action) => {
      state.confirmOpen = true;
      state.selectedBarang = action.payload;
    },
    closeDeleteConfirm: (state) => {
      state.confirmOpen = false;
      state.selectedBarang = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBarang.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBarang.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchBarang.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBarang.fulfilled, (state) => {
        state.modalOpen = false;
      })
      .addCase(editBarang.fulfilled, (state) => {
        state.modalOpen = false;
      })
      .addCase(deleteBarang.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.barang_id !== action.payload);
        state.confirmOpen = false;
      })
      .addCase(fetchSatuan.fulfilled, (state, action) => {
        state.satuanList = action.payload;
      });
  },
});

export const {
  openAddModal,
  openEditModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = barangSlice.actions;

export default barangSlice.reducer;
