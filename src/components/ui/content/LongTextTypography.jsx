import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const LongTextTypography = ({ text, maxLength = 100 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const displayText = text
    ? expanded
      ? text
      : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")
    : null;

  return (
    <Typography variant="body1" color="inherit" sx={{ maxWidth: "500px" }}>
      {displayText}
      {text && text.length > maxLength && (
        <Button
          onClick={toggleExpanded}
          size="small"
          variant="text"
          color="info"
        >
          {expanded ? "Lire moins" : "Lire plus"}
        </Button>
      )}
    </Typography>
  );
};

export default LongTextTypography;

LongTextTypography.propTypes = {
  text: PropTypes.string,
  maxLength: PropTypes.number.isRequired,
};
