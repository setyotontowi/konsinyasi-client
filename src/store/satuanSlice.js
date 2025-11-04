// src/store/satuanSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// =====================
// Async Thunks
// =====================

// Fetch satuan list
export const fetchSatuan = createAsyncThunk(
  "satuan/fetchSatuan",
  async ({ page = 1, limit = 20, nama = "" }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/barang/satuan?page=${page}&limit=${limit}&nama=${encodeURIComponent(nama)}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add satuan
export const addSatuan = createAsyncThunk(
  "satuan/addSatuan",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/barang/satuan", payload);
      toast.success("Satuan berhasil ditambahkan!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan satuan.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Edit satuan
export const editSatuan = createAsyncThunk(
  "satuan/editSatuan",
  async ({ mst_id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/barang/satuan/${mst_id}`, payload);
      toast.success("Satuan berhasil diperbarui!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui satuan.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete satuan
export const deleteSatuan = createAsyncThunk(
  "satuan/deleteSatuan",
  async (mst_id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/barang/satuan/${mst_id}`);
      toast.success("Satuan berhasil dihapus!");
      return mst_id;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus satuan.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// =====================
// Slice Definition
// =====================
const satuanSlice = createSlice({
  name: "satuan",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,

    modalOpen: false,
    confirmOpen: false,
    mode: "add",
    selectedSatuan: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.mode = "add";
      state.selectedSatuan = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "edit";
      state.selectedSatuan = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.selectedSatuan = null;
      state.mode = "add";
    },
    openDeleteConfirm: (state, action) => {
      state.confirmOpen = true;
      state.selectedSatuan = action.payload;
    },
    closeDeleteConfirm: (state) => {
      state.confirmOpen = false;
      state.selectedSatuan = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSatuan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSatuan.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchSatuan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSatuan.fulfilled, (state) => {
        state.modalOpen = false;
      })
      .addCase(editSatuan.fulfilled, (state) => {
        state.modalOpen = false;
      })
      .addCase(deleteSatuan.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.mst_id !== action.payload);
        state.confirmOpen = false;
      });
  },
});

export const {
  openAddModal,
  openEditModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = satuanSlice.actions;

export default satuanSlice.reducer;
