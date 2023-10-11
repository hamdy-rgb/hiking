import React from "react";
import PropTypes from "prop-types";
import { styled, MenuItem } from "@mui/material";
import { BSSelect } from "../BSSelectMenu";

const Select = styled(BSSelect)(({ theme }) => ({
  "& .MuiSelect-select": {
    border: "0px",
    "&:hover": {
      border: "0px",
    },
  },
  "& .MuiSelect-icon": {
    marginRight: 0,
  },
  width: "145px",
}));

const CostumBSSelect = ({ layout, handleChangeLayout, menuItem, ...props }) => {
  return (
    <Select value={layout} onChange={handleChangeLayout} {...props}>
      {menuItem.map(item => (
        <MenuItem key={item.value} value={item.value}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CostumBSSelect;

CostumBSSelect.propTypes = {
  layout: PropTypes.string.isRequired,
  handleChangeLayout: PropTypes.func.isRequired,
  menuItem: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};
