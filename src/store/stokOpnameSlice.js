import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { getAuthUser } from "../helper/helper";

export const fetchStokOpname = createAsyncThunk(
  "stokOpname/fetch",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/inventory/stok-opname?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchStokOpnameById = createAsyncThunk(
  "stokOpname/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/inventory/stok-opname/${id}`);
      return res.data.data; // response has data object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createStokOpname = createAsyncThunk(
  "stokOpname/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/inventory/stok-opname`, data);
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const updateStokOpname = createAsyncThunk(
  "stokOpname/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/inventory/stok-opname/${data.id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const stokOpnameSlice = createSlice({
  name: "stokOpname",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,

    modalOpen: false,
    confirmOpen: false,
    selectedItem: null,
    itemToDelete: null,
  },

  reducers: {
    openAddModal: (state) => {
      state.modalOpen = true;
      state.selectedItem = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.selectedItem = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
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
      state.selectedItem = action.payload;
    },
    openDistribusiModal: (state, action) => {
      state.modalOpen = true;
      state.selectedItem = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---- Fetch ----
      .addCase(fetchStokOpname.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStokOpname.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          totalPages: action.payload.pagination.total_pages,
          totalItems: action.payload.pagination.total,
        };
      })
      .addCase(fetchStokOpname.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- fetch by ID ---
      .addCase(fetchStokOpnameById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      .addCase(fetchStokOpnameById.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateStokOpname.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateStokOpname.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStokOpname.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStokOpname.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  openAddModal,
  openViewModal, 
  openEditModal, 
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = stokOpnameSlice.actions;

export default stokOpnameSlice.reducer;