import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    listReload: 0,
    modalOpen: false,
    confirmOpen: false,
    mode: "add", // 'add' or 'edit'
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
    triggerReload: (state) => {
      state.listReload++;
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
});

export const {
  openAddModal,
  openEditModal,
  closeUserModal,
  triggerReload,
  openDeleteConfirm,
  closeDeleteConfirm,
} = userSlice.actions;

export default userSlice.reducer;