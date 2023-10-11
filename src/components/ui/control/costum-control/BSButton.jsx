import React, { useState } from "react";
import { Button, styled } from "@mui/material";
import PropTypes from "prop-types";

const CustomButton = styled(Button)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const BSButton = ({ id, openModal }) => {
  const [buttonLabel, setButtonLabel] = useState("Non publié");

  return (
    <CustomButton
      variant="contained"
      sx={{
        minWidth: "110px",
      }}
      color="info"
      onMouseEnter={() => setButtonLabel("Publier")}
      onMouseLeave={() => setButtonLabel("Non publié")}
      onClick={() => openModal(id)}
    >
      {buttonLabel}
    </CustomButton>
  );
};

export default BSButton;

BSButton.propTypes = {
  id: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
};
