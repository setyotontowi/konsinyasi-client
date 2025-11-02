import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// ====================
//  Async Thunks
// ====================

// Fetch users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/user?page=${page}&limit=${limit}&user=${encodeURIComponent(search)}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add user
export const addUser = createAsyncThunk(
  "user/addUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/auth/register", payload);
      toast.success("Pengguna berhasil ditambahkan!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan pengguna.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Edit user
export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/user/${id}`, payload);
      toast.success("Pengguna berhasil diperbarui!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui pengguna.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete(`/user/${id}`);
      toast.success("Pengguna berhasil dihapus!");
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus pengguna.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);



// ====================
//  Slice Definition
// ====================

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,

    modalOpen: false,
    confirmOpen: false,
    mode: "add",
    selectedUser: null,
    userToDelete: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.mode = "add";
      state.selectedUser = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "edit";
      state.selectedUser = action.payload;
    },
    closeUserModal: (state) => {
      state.modalOpen = false;
      state.mode = "add";
      state.selectedUser = null;
    },
    openDeleteConfirm: (state, action) => {
      state.confirmOpen = true;
      state.userToDelete = action.payload;
    },
    closeDeleteConfirm: (state) => {
      state.confirmOpen = false;
      state.userToDelete = null;
    },
  },

  // ====================
  //  Handle async actions
  // ====================
  extraReducers: (builder) => {
    builder
      // ---- Fetch Users ----
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Add User ----
      .addCase(addUser.fulfilled, (state) => {
        state.modalOpen = false;
      })

      // ---- Edit User ----
      .addCase(editUser.fulfilled, (state) => {
        state.modalOpen = false;
      })

      // ---- Delete User ----
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
        state.confirmOpen = false;
      });
  },
});

export const {
  openAddModal,
  openEditModal,
  closeUserModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = userSlice.actions;

export default userSlice.reducer;
