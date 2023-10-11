import React, { createRef } from "react";
import { Field } from "formik";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { IconButton } from "@mui/material";
import "./input.css";

const BSFileUpload = ({
  name,
  isUpdateMode = false,
  existingFileUrl,
  customClass,
}) => {
  const dropzoneRef = createRef();

  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  return (
    <Field name={name}>
      {({ form }) => {
        const { setFieldValue } = form;
        return (
          <Dropzone
            ref={dropzoneRef}
            noClick
            noKeyboard
            multiple
            onDrop={acceptedFiles => {
              setFieldValue(name, acceptedFiles[0]);
            }}
            accept={{
              "image/*": [".png", ".jpeg", ".jpg"],
              "application/pdf": [".pdf"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/msword": [".doc"],
            }}
          >
            {({ getRootProps, getInputProps, acceptedFiles }) => {
              return (
                <div
                  {...getRootProps({ className: `dropzone ${customClass}` })}
                >
                  <input {...getInputProps()} />
                  <div>
                    <IconButton type="button" onClick={openDialog}>
                      <AttachFileOutlinedIcon />
                    </IconButton>
                  </div>
                  <div>
                    {acceptedFiles[0] === undefined
                      ? isUpdateMode && typeof existingFileUrl === "string"
                        ? `${existingFileUrl?.slice(0, 15)}...`
                        : ""
                      : `${acceptedFiles[0]?.name.slice(0, 15)}...`}
                  </div>
                </div>
              );
            }}
          </Dropzone>
        );
      }}
    </Field>
  );
};

export default BSFileUpload;

BSFileUpload.propTypes = {
  name: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  isUpdateMode: PropTypes.bool,
  existingFileUrl: PropTypes.any,
};
