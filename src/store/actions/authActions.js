import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ adminEmail, adminPassword }) => {
    const response = await axios.post(
      `${process.env.HTTPS_ENDPOINT}/auth/login`,
      {
        email: adminEmail,
        password: adminPassword,
      },
    );

    const {
      uid,
      email,
      displayName,
      idToken,
      refreshToken,
      expiresIn,
      photoUrl,
      firstName,
      lastName,
    } = response.data;

    localStorage.setItem(
      process.env.LOCAL_STORAGE_KEYS,
      JSON.stringify({
        uid,
        email,
        displayName,
        photoUrl,
        firstName,
        lastName,
      }),
    );

    localStorage.setItem("id-token", idToken);
    localStorage.setItem("refresh-token", refreshToken);
    localStorage.setItem("expires-in", expiresIn);

    axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;

    return response.data;
  },
);
