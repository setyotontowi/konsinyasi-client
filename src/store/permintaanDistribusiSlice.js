import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// ====================
//  Async Thunks
// ====================

// Fetch list
export const fetchPermintaanDistribusi = createAsyncThunk(
  "permintaanDistribusi/fetch",
  async ({ page = 1, limit = 20, search = "", onDistribusi = false }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/distribusi/permintaan?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&permintaan=${onDistribusi}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single record detail by ID
export const fetchPermintaanDistribusiById = createAsyncThunk(
  "permintaanDistribusi/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/distribusi/permintaan/${id}`);
      return res.data?.data; // expects structure { data: {..., items: []} }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Gagal mengambil detail permintaan distribusi.";
      return rejectWithValue(msg);
    }
  }
);

// Add new record
export const addPermintaanDistribusi = createAsyncThunk(
  "permintaanDistribusi/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/distribusi/permintaan", payload);
      toast.success("Permintaan distribusi berhasil ditambahkan!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan permintaan distribusi.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Edit record
export const editPermintaanDistribusi = createAsyncThunk(
  "permintaanDistribusi/edit",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/distribusi/permintaan/${id}`, payload);
      toast.success("Permintaan distribusi berhasil diperbarui!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui permintaan distribusi.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const kirimDistribusi = createAsyncThunk(
  "distribusi/distribusi",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("auth_token");
      const decoded = jwtDecode(token);
      const id_user = decoded.id; 

      const body = {
        id_permintaan_distribusi : id,
        id_master_unit : payload.id_master_unit,
        id_users: id_user
      }
      const res = await axiosClient.post(`/distribusi/distribusi`, body);
      toast.success("Permintaan distribusi berhasil diperbarui!");
      return res.data;
    } catch (err) {
      console.log(err)
      const msg = err.response?.data?.message || "Gagal memperbarui permintaan distribusi.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete record
export const deletePermintaanDistribusi = createAsyncThunk(
  "permintaanDistribusi/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete(`/distribusi/permintaan/${id}`);
      toast.success("Permintaan distribusi berhasil dihapus!");
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus permintaan distribusi.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ====================
//  Slice Definition
// ====================

const permintaanDistribusiSlice = createSlice({
  name: "permintaanDistribusi",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,

    modalOpen: false,
    confirmOpen: false,
    mode: "add",
    selectedItem: null,
    itemToDelete: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.mode = "add";
      state.selectedItem = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "edit";
      state.selectedItem = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.mode = "add";
      state.selectedItem = null;
    },
    openDeleteConfirm: (state, action) => {
      state.confirmOpen = true;
      state.itemToDelete = action.payload;
    },
    closeDeleteConfirm: (state) => {
      state.confirmOpen = false;
      state.itemToDelete = null;
    },
    openViewModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "view";
      state.selectedItem = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---- Fetch ----
      .addCase(fetchPermintaanDistribusi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermintaanDistribusi.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchPermintaanDistribusi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Fetch by ID ----
      .addCase(fetchPermintaanDistribusiById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermintaanDistribusiById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload; // store fetched record
      })
      .addCase(fetchPermintaanDistribusiById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Add ----
      .addCase(addPermintaanDistribusi.fulfilled, (state) => {
        state.modalOpen = false;
      })

      // ---- Edit ----
      .addCase(editPermintaanDistribusi.fulfilled, (state) => {
        state.modalOpen = false;
      })

      // ---- Delete ----
      .addCase(deletePermintaanDistribusi.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.pd_id !== action.payload);
        state.confirmOpen = false;
      });  
  },
});

export const {
  openAddModal,
  openEditModal,
  openViewModal, 
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = permintaanDistribusiSlice.actions;

export default permintaanDistribusiSlice.reducer;
