import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import PropTypes from "prop-types";

const BSRadioGroup = ({ label, name, options, ...rest }) => {
  const [field, meta] = useField(name);

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup {...field} {...rest}>
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size="small" />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText sx={{ color: "error.main" }}>
        {meta.touched && meta.error}
      </FormHelperText>
    </FormControl>
  );
};

export default BSRadioGroup;

BSRadioGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
