import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuItem, menuClasses } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const Item = ({ title, to, icon, unactive = false }) => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const handleMenuItem = href => {
    navigate(href);
  };

  useEffect(() => {
    setIsActive(pathname === to);
  }, [pathname, to]);

  return (
    <MenuItem
      onClick={() => handleMenuItem(to)}
      icon={icon}
      className={unactive === true ? null : isActive && "active"}
      rootStyles={{
        ["." + menuClasses.button]: {
          "&:hover": {
            color: theme.palette.primary.light,
          },
        },
      }}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

export default Item;

Item.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.object,
  unactive: PropTypes.bool,
};
