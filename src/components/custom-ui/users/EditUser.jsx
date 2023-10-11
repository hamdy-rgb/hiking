/* eslint-disable guard-for-in */
import React, { useEffect, useState } from "react";
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
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { BSSnackbar, Loading, ErrorMessage } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";
import api from "../../../utils/api";

const initialValues = {
  userPhoto: "",
  firstName: "",
  lastName: "",
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("Veuillez saisir votre adresse e-mail"),
  firstName: Yup.string().required("Veuillez saisir votre prénom"),
  lastName: Yup.string().required("Veuillez saisir votre nom de famille"),
});

const getUserData = async id => {
  const response = await api.get(`${process.env.HTTPS_ENDPOINT}/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const EditUser = ({ open, setOpen, id }) => {
  const { sasTokens } = useSelector(state => state.sasToken);

  const [initialUserValue, setInitialUserValue] = useState({
    userPhoto: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["userData", id],
    () => getUserData(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setInitialUserValue({
        userPhoto: data.photoUrl
          ? `${data.photoUrl}?${sasTokens.fileStorage}`
          : "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    }
  }, [data, isLoading]);

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;
    setSubmitting(false);

    const formData = new FormData();
    formData.append("userPhoto", values.userPhoto);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);

    api
      .put(`${process.env.HTTPS_ENDPOINT}/user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "L'Administrateur a été mis à jour avec succès.",
        });

        setValues(initialValues);

        refetch();

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
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <Container sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="initial">
                Modifier Administrateur
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Formik
                initialValues={initialUserValue || initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {({ isSubmitting, initialValues }) => {
                  const { userPhoto } = initialValues;
                  return (
                    <Form encType="multipart/form-data">
                      <Stack gap={1}>
                        <FormControl variant="standard">
                          <FileUpload
                            name="userPhoto"
                            accept={{ "image/*": [".png", ".jpeg", ".jpg"] }}
                            previewSize={150}
                            initialValue={userPhoto}
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
                          disabled={isSubmitting}
                          loading={isSubmitting}
                        >
                          Sauvegarder
                        </LoadingButton>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Container>
        )}
      </BSDrawer>
    </>
  );
};

export default EditUser;

EditUser.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
