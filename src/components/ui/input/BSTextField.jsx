import React from "react";
import { styled, OutlinedInput, FormHelperText } from "@mui/material";
import { Field } from "formik";
import PropTypes from "prop-types";

export const BSOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  minWidth: 300,
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    backgroundColor: "#F1F4FA",
    borderRadius: theme.shape.borderRadius,
    position: "relative",
    fontSize: 16,
    padding: "10px 16px",
  },
  backgroundColor: "#F1F4FA",
}));

const BSTextField = ({ name, type = "text", ...props }) => {
  return (
    <Field name={name}>
      {({ field, meta }) => {
        if (type === "hidden") {
          return (
            <>
              <FormHelperText sx={{ color: "error.main" }}>
                {meta.touched && meta.error}
              </FormHelperText>
            </>
          );
        }

        return (
          <>
            <BSOutlinedInput type={type} {...props} {...field} />
            <FormHelperText sx={{ color: "error.main" }}>
              {meta.touched && meta.error}
            </FormHelperText>
          </>
        );
      }}
    </Field>
  );
};

export default BSTextField;

BSTextField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};
