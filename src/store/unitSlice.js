// src/store/unitSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// ====================
//  Async Thunks
// ====================

// Fetch units
export const fetchUnits = createAsyncThunk(
  "unit/fetchUnits",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/unit?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add unit
export const addUnit = createAsyncThunk(
  "unit/addUnit",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/unit", payload);
      toast.success("Unit berhasil ditambahkan!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan unit.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Edit unit
export const editUnit = createAsyncThunk(
  "unit/editUnit",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/unit/${id}`, payload);
      toast.success("Unit berhasil diperbarui!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui unit.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete unit
export const deleteUnit = createAsyncThunk(
  "unit/deleteUnit",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete(`/unit/${id}`);
      toast.success("Unit berhasil dihapus!");
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus unit.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ====================
//  Slice Definition
// ====================

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,

    modalOpen: false,
    confirmOpen: false,
    mode: "add",
    selectedUnit: null,
    unitToDelete: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.mode = "add";
      state.selectedUnit = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "edit";
      state.selectedUnit = action.payload;
    },
    closeUnitModal: (state) => {
      state.modalOpen = false;
      state.mode = "add";
      state.selectedUnit = null;
    },
    openDeleteConfirm: (state, action) => {
      state.confirmOpen = true;
      state.unitToDelete = action.payload;
    },
    closeDeleteConfirm: (state) => {
      state.confirmOpen = false;
      state.unitToDelete = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---- Fetch Units ----
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Add Unit ----
      .addCase(addUnit.fulfilled, (state) => {
        state.modalOpen = false;
      })

      // ---- Edit Unit ----
      .addCase(editUnit.fulfilled, (state) => {
        state.modalOpen = false;
      })

      // ---- Delete Unit ----
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
        state.confirmOpen = false;
      });
  },
});

export const {
  openAddModal,
  openEditModal,
  closeUnitModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = unitSlice.actions;

export default unitSlice.reducer;
