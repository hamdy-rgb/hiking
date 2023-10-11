import React from "react";
import { Typography, Box, styled } from "@mui/material";

const NoMessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  minWidth: "80vh",
}));

const NoDataMessage = () => {
  return (
    <NoMessageContainer>
      <Typography variant="h4" sx={{ fontWeight: 600, color: "#777" }}>
        Il n&apos;y a pas de données
      </Typography>
    </NoMessageContainer>
  );
};

export default NoDataMessage;
