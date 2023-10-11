import React, { useState } from "react";
import { Box, IconButton, styled, FormHelperText } from "@mui/material";
import { useField } from "formik";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";

const UploadFileBox = styled(Box)(({ theme }) => ({
  width: 125,
  height: 125,
  backgroundColor: "#F1F4FA",
  borderRadius: 62.5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  width: 125,
  height: 125,
  borderRadius: 62.5,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

const FileUpload = ({ name, previewSize, initialValue, accept, ...props }) => {
  const [, meta, helpers] = useField(name);
  const [imageUrl, setImageUrl] = useState(initialValue);
  const handleDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.onerror = error => {
      console.error(error);
    };

    reader.readAsDataURL(file);
    helpers.setValue(file);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    helpers.setValue("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: accept,
    multiple: false,
  });

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {imageUrl ? (
          <ImagePreview
            sx={{
              width: previewSize,
              height: previewSize,
              borderRadius: "50%",
              backgroundImage: `url(${imageUrl})`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <IconButton onClick={handleRemoveImage}>
                <HighlightOffOutlinedIcon />
              </IconButton>
            </Box>
          </ImagePreview>
        ) : (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <UploadFileBox>
              <CameraAltOutlinedIcon />
            </UploadFileBox>
          </div>
        )}
      </Box>
      <FormHelperText sx={{ color: "error.main" }}>
        {meta.touched && meta.error}
      </FormHelperText>
    </>
  );
};

export default FileUpload;

FileUpload.propTypes = {
  name: PropTypes.string.isRequired,
  previewSize: PropTypes.number,
  initialValue: PropTypes.any,
  accept: PropTypes.object.isRequired,
};

FileUpload.defaultProps = {
  previewSize: 125,
  initialValue: null,
};
