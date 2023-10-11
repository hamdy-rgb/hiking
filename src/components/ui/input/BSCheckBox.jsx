import React, { useRef, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import PropTypes from "prop-types";
import { Field } from "formik";

export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} size="small" />
      </>
    );
  },
);

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
};

export const BSCheckBox = ({ label, ...props }) => {
  return (
    <FormControlLabel
      control={<Field as={Checkbox} type="checkbox" {...props} />}
      label={label}
    />
  );
};

BSCheckBox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
