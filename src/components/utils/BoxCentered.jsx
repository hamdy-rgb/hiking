import { Box, styled } from "@mui/material";

const BoxCentered = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export default BoxCentered;
