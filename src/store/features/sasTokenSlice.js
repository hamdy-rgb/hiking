import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  loading: false,
  sasTokens: {
    fileStorage: "",
    blobStorage: "",
  },
  error: "",
};

export const fetchSasTokens = createAsyncThunk(
  "sasTokens/fetchSasTokens",
  async () => {
    const response = await api.get(
      `${process.env.HTTPS_ENDPOINT}/auth/generate-sas-token`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      },
    );

    return response.data;
  },
);

const sasTokenSlice = createSlice({
  name: "sasTokens",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSasTokens.pending, state => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchSasTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.sasTokens.fileStorage = action.payload.fileStorageSasToken;
        state.sasTokens.blobStorage = action.payload.blobStorageSasToken;
      })
      .addCase(fetchSasTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch SAS tokens";
      });
  },
});

export default sasTokenSlice.reducer;
