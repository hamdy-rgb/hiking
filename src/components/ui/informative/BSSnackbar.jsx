import React from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const BSSnackbar = ({ open, setOpen, message, severity, ...props }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={() => setOpen(false)}
      {...props}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

BSSnackbar.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  message: PropTypes.string,
  severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

BSSnackbar.defaultProps = {
  severity: "success",
};

export default BSSnackbar;
