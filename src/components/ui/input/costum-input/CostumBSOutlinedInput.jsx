import React from "react";
import { styled } from "@mui/material";
import { BSOutlinedInput } from "../BSTextField";

const OutlinedInput = styled(BSOutlinedInput)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  "& .MuiInputBase-input": {
    backgroundColor: theme.palette.common.white,
  },
}));

const CostumBSOutlinedInput = ({ ...props }) => {
  return <OutlinedInput {...props} />;
};

export default CostumBSOutlinedInput;
