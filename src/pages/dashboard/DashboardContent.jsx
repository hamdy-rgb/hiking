import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useProSidebar } from "react-pro-sidebar";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchSasTokens } from "../../store/features/sasTokenSlice";
import { Sidebar } from "../../components/internal-component";
import { Users, Dashboard, Category, Event } from "./";

const DashboardContent = () => {
  const { collapsed } = useProSidebar();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSasTokens());
  }, []);
  return (
    <Box sx={{ display: "flex", backgroundColor: "#F1F4FA" }}>
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          marginLeft: collapsed ? "80px" : "240px",
          pb: 1,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="admin" element={<Users />} />
          <Route path="categories" element={<Category />} />/
          <Route path="events" element={<Event />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardContent;
