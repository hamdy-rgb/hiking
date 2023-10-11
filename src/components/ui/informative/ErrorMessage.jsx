import React from "react";
import PropTypes from "prop-types";
import { Typography, Box, styled, Button } from "@mui/material";
import BoxCentered from "../../utils/BoxCentered";

const NoMessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
}));

const ErrorMessage = ({ getData = null }) => {
  return (
    <NoMessageContainer>
      <Box>
        <Typography variant="body1" mb={1} color="inherit">
          Une erreur s&apos;est produite.
        </Typography>
        <BoxCentered>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={getData}
          >
            Retraite
          </Button>
        </BoxCentered>
      </Box>
    </NoMessageContainer>
  );
};

export default ErrorMessage;

ErrorMessage.propTypes = {
  getData: PropTypes.func,
};
