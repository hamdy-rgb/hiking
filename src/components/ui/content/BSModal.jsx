import React from "react";
import PropTypes from "prop-types";
import { Modal, Box, styled } from "@mui/material";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "10px",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const BSModal = ({ open, setOpen, children, ...props }) => {
  return (
    <StyledModal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      {...props}
    >
      <ModalBox>{children}</ModalBox>
    </StyledModal>
  );
};

export default BSModal;

BSModal.propTypes = {
  children: PropTypes.node.isRequired,
  setOpen: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
