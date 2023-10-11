import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form } from "formik";
import { BSTextField } from "../../ui/input";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { BSSnackbar } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";
import api from "../../../utils/api";

const initialValues = {
  name: "",
  description: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Veuillez saisir le nom de la catégorie"),
  description: Yup.string(),
});

const AddCategory = ({ open, setOpen }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, actions) => {
    const { setSubmitting, setValues } = actions;

    api
      .post(`${process.env.HTTPS_ENDPOINT}/category`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "La catégorie a été ajoutée avec succès",
        });

        setValues(initialValues);
        setOpen(false);
      })
      .catch(error => {
        setHandleOpenSnackbar({
          open: true,
          severity: "error",
          message: "Quelque chose s'il vous plaît réessayer plus tard",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <BSSnackbar
        open={handleOpenSnackbar.open}
        severity={handleOpenSnackbar.severity}
        setOpen={setHandleOpenSnackbar}
        message={handleOpenSnackbar.message}
      />

      <BSDrawer open={open} setOpen={setOpen}>
        <Container sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" color="initial">
              Ajouter Catégorie
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <Stack gap={2}>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="name">
                          Nom de la catégorie
                        </InputLabel>
                        <BSTextField
                          type="text"
                          placeholder="Nom de la catégorie"
                          name="name"
                        />
                      </FormControl>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="description">
                          Description de la catégorie
                        </InputLabel>
                        <BSTextField
                          type="text"
                          placeholder="Description de la catégorie"
                          name="description"
                        />
                      </FormControl>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="medium"
                        fullWidth={true}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Ajouter catégorie
                      </LoadingButton>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Container>
      </BSDrawer>
    </>
  );
};

export default AddCategory;

AddCategory.propTypes = {
  id: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
