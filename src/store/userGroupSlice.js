// src/store/userGroupSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

// ====================
//  Async Thunks
// ====================

// Fetch user groups
export const fetchUserGroups = createAsyncThunk(
  "userGroup/fetchUserGroups",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/user/group");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add group
export const addUserGroup = createAsyncThunk(
  "userGroup/addUserGroup",
  async ({ payload }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/group", payload);
      toast.success("Grup berhasil ditambahkan!");
      dispatch(fetchUserGroups());
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan grup.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Edit group
export const editUserGroup = createAsyncThunk(
  "userGroup/editUserGroup",
  async ({ id, payload }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/user/group/${id}`, payload);
      toast.success("Grup berhasil diperbarui!");
      dispatch(fetchUserGroups());
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui grup.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete group
export const deleteUserGroup = createAsyncThunk(
  "userGroup/deleteUserGroup",
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.delete(`/user/group/${id}`);
      toast.success("Grup berhasil dihapus!");
      dispatch(fetchUserGroups());
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus grup.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ====================
//  Slice Definition
// ====================

const userGroupSlice = createSlice({
  name: "userGroup",
  initialState: {
    list: [],
    loading: false,
    error: null,
    modalOpen: false,
    confirmOpen: false,
    mode: "add",
    selectedGroup: null,
    groupToDelete: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.mode = "add";
      state.selectedGroup = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.mode = "edit";
      state.selectedGroup = action.payload;
    },
    closeUserGroupModal: (state) => {
      state.modalOpen = false;
      state.selectedGroup = null;
    },
    openDeleteConfirm: (state, action) => {
      state.confirmOpen = true;
      state.groupToDelete = action.payload;
    },
    closeDeleteConfirm: (state) => {
      state.confirmOpen = false;
      state.groupToDelete = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUserGroup.fulfilled, (state) => {
        state.modalOpen = false;
      })
      .addCase(editUserGroup.fulfilled, (state) => {
        state.modalOpen = false;
      })
      .addCase(deleteUserGroup.fulfilled, (state) => {
        state.confirmOpen = false;
      });
  },
});

export const {
  openAddModal,
  openEditModal,
  closeUserGroupModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = userGroupSlice.actions;

export default userGroupSlice.reducer;
