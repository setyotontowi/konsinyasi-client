import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const fetchDistribusi = createAsyncThunk(
  "distribusi/fetch",
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      // Only append filters that actually have values
      if (filters.id_master_unit?.value)
        params.append("id_master_unit", filters.id_master_unit.value);

      if (filters.id_master_unit_tujuan?.value)
        params.append("id_master_unit_tujuan", filters.id_master_unit_tujuan.value);

      if (filters.id_permintaan_distribusi)
        params.append("id_permintaan_distribusi", filters.id_permintaan_distribusi);

      if (filters.start_date)
        params.append("start_date", filters.start_date);

      if (filters.end_date)
        params.append("end_date", filters.end_date);

      const res = await axiosClient.get(
        `/distribusi/distribusi?${params.toString()}`
      );

      const modifiedData = res.data.data.map((item) => ({
        ...item,
        pd_id: item.id_permintaan_distribusi,
      }));

      return { ...res.data, data: modifiedData };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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


const distribusiSlice = createSlice({
  name: "distribusi",
  initialState: {
    list: [],
    pagination: { page: 1, totalPages: 1, totalItems: 0 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistribusi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistribusi.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        const p = action.payload.pagination || {};
        state.pagination = {
          page: p.page || 1,
          totalPages: p.total_pages || 1,
          totalItems: p.total || 0,
        };
      })
      .addCase(fetchDistribusi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(kirimDistribusi.pending, (state) => {
        state.loading = true;
      })
      .addCase(kirimDistribusi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(kirimDistribusi.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default distribusiSlice.reducer;
