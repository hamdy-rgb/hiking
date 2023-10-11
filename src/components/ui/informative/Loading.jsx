import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";

const Loading = ({ height = "100vh" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: height,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;

Loading.propTypes = {
  height: PropTypes.string,
};
