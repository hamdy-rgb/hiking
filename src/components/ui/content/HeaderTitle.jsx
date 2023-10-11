import React from "react";
import { Typography, Box, styled } from "@mui/material";
import PropTypes from "prop-types";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  py: 1,
}));

const HeaderTitle = ({ children, title }) => {
  return (
    <StyledBox>
      {title && (
        <Typography variant="h4" color="initial">
          {title}
        </Typography>
      )}
      {children && <Box>{children}</Box>}
    </StyledBox>
  );
};

export default HeaderTitle;

HeaderTitle.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
