import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../actions/authActions";

const initialState = {
  loading: false,
  uid: "",
  email: "",
  displayName: "",
  photoUrl: "",
  firstName: "",
  lastName: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.loading = false;
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoUrl = action.payload.photoUrl;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.error = null;
    },

    logout: state => {
      state.loading = false;
      state.uid = "";
      state.email = "";
      state.displayName = "";
      state.photoUrl = "";
      state.firstName = "";
      state.lastName = "";
      state.error = null;

      localStorage.removeItem(process.env.LOCAL_STORAGE_KEYS);
      localStorage.removeItem("id-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("expires-in");
    },
  },
  extraReducers: builder => {
    builder.addCase(loginAdmin.pending, state => {
      state.loading = true;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoUrl = action.payload.photoUrl;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.error = null;
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.uid = "";
      state.email = "";
      state.displayName = "";
      state.photoUrl = "";
      state.firstName = "";
      state.lastName = "";
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
