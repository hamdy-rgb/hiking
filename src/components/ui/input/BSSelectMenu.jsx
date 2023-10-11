import React from "react";
import { Select, styled, MenuItem, FormHelperText } from "@mui/material";
import { useField } from "formik";
import PropTypes from "prop-types";

export const BSSelect = styled(Select)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiSelect-select": {
    backgroundColor: "#F1F4FA",
    borderRadius: theme.shape.borderRadius,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 16px",
    "&:focus": {
      borderWidth: "2px",
      borderColor: theme.palette.primary.main,
    },
    "&:hover": {
      border: "1px solid black",
    },
  },
  "&:before": {
    display: "none !important",
  },
  "&:after": {
    display: "none !important",
  },
}));

const BSSelectMenu = ({ menuList, name, label, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <>
      <BSSelect label={label} {...field} {...props}>
        {menuList.map(list => {
          return (
            <MenuItem key={list.id} value={list.id} selected={true}>
              {list.value}
            </MenuItem>
          );
        })}
      </BSSelect>
      <FormHelperText sx={{ color: "error.main" }}>
        {meta.touched && meta.error}
      </FormHelperText>
    </>
  );
};

export default BSSelectMenu;

BSSelectMenu.propTypes = {
  menuList: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};
