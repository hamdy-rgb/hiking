import React, { useState } from "react";
import { IconButton, Button, MenuItem, Menu, Box } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PropTypes from "prop-types";

const BSMenu = ({ buttons }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = buttonIndex => {
    buttons[buttonIndex].onClick();
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {buttons.map((button, index) => (
          <MenuItem
            key={index}
            sx={{
              "&:hover": {
                backgroundColor: "white",
                cursor: "default",
              },
            }}
            disableRipple
          >
            <Button
              startIcon={button.startIcon}
              variant={button.variant || "contained"}
              color={button.color || "primary"}
              fullWidth={button.fullWidth || false}
              onClick={() => handleButtonClick(index)}
            >
              {button.label}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default BSMenu;

BSMenu.propTypes = {
  buttons: PropTypes.array.isRequired,
};
