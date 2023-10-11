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
import { BSTextField, FileUpload } from "../../ui/input";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { BSSnackbar } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";
import api from "../../../utils/api";

const initialValues = {
  userPhoto: "",
  firstName: "",
  lastName: "",
  email: "",
};

const validationSchema = Yup.object({
  userPhoto: Yup.mixed()
    .test(
      "file-size",
      "La taille de l'image est trop grande (max 1MB)",
      value => {
        return !value || (value && value.size <= 1000000);
      },
    )
    .test(
      "file-min-size",
      "La taille de l'image est trop petite (min 200KB)",
      value => {
        return !value || (value && value.size >= 200000);
      },
    ),
  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("Veuillez saisir votre adresse e-mail"),
  firstName: Yup.string().required("Veuillez saisir votre prénom"),
  lastName: Yup.string().required("Veuillez saisir votre nom de famille"),
});

const AddUser = ({ open, setOpen }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;

    const formData = new FormData();
    formData.append("userPhoto", values.userPhoto);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);

    api
      .post(`${process.env.HTTPS_ENDPOINT}/user`, formData, {
        headers: {
          "Content-Type": "multipart/data",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le Administrateur a été ajouté avec succès",
        });

        setValues(initialValues);
        setOpen(false);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "Email address is already in use.") {
          setFieldError(
            "email",
            "L'adresse e-mail est déjà utilisée par un autre compte.",
          );
        } else if (error === "Phone number is already in use.") {
          setFieldError(
            "phoneNumber",
            "L'Administrateur avec le numéro de téléphone fourni existe déjà.",
          );
        } else {
          setHandleOpenSnackbar({
            open: true,
            severity: "error",
            message: "Quelque chose s'il vous plaît réessayer plus tard",
          });
        }
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
              Ajouter Admin
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
                  <Form encType="multipart/form-data">
                    <Stack gap={1}>
                      <FormControl variant="standard">
                        <FileUpload
                          name="userPhoto"
                          accept={{ "image/*": [".png", ".jpeg", ".jpg"] }}
                          previewSize={150}
                        />
                      </FormControl>
                      {/* first name */}
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="firstName">
                          Prénom
                        </InputLabel>
                        <BSTextField
                          type="text"
                          placeholder="Prénom"
                          name="firstName"
                        />
                      </FormControl>
                      {/* last name */}
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="lastName">
                          Nom
                        </InputLabel>
                        <BSTextField
                          type="text"
                          placeholder="Nom"
                          name="lastName"
                        />
                      </FormControl>
                      {/* email */}
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="email">
                          Addresse Mail
                        </InputLabel>
                        <BSTextField
                          name="email"
                          type="email"
                          placeholder="Email"
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
                        Ajouter administrateur
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

export default AddUser;

AddUser.propTypes = {
  id: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
