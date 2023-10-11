import React from "react";
import { Drawer, styled } from "@mui/material";
import PropTypes from "prop-types";

const CostumDrawer = styled(Drawer)(({ theme }) => ({
  width: 400,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 400,
    backgroundColor: "white",
  },
}));

const BSDrawer = ({ children, anchor = "right", open, setOpen, ...props }) => {
  const onClose = () => setOpen(false);
  return (
    <CostumDrawer anchor={anchor} open={open} onClose={onClose} {...props}>
      {children}
    </CostumDrawer>
  );
};

export default BSDrawer;

BSDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  anchor: PropTypes.string,
};
