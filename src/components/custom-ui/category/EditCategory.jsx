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
import { BSTextField } from "../../ui/input";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { BSSnackbar, Loading, ErrorMessage } from "../../ui/informative";
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

const getCategoryData = async id => {
  const response = await api.get(
    `${process.env.HTTPS_ENDPOINT}/category/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("id-token")}`,
      },
    },
  );
  return response.data;
};

const EditCategory = ({ open, setOpen, id }) => {
  const [initialCategoryValue, setInitialCategoryValue] = useState({
    name: "",
    description: "",
  });

  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["categoryData", id],
    () => getCategoryData(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: true,
    },
  );

  console.log(data, id);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setInitialCategoryValue({
        name: data.name,
        description: data.description,
      });
    }
  }, [data, isLoading]);

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;
    setSubmitting(false);

    api
      .put(`${process.env.HTTPS_ENDPOINT}/category/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "La catégorie a été mise à jour avec succès.",
        });

        setValues(initialValues);

        refetch();

        setOpen(false);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        // Handle category-specific error messages here
        if (error === "Category name is already in use.") {
          setFieldError("name", "Le nom de la catégorie est déjà utilisé.");
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
                Modifier Catégorie
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Formik
                initialValues={initialCategoryValue || initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize
              >
                {({ isSubmitting, initialValues }) => {
                  return (
                    <Form>
                      <Stack gap={1}>
                        {/* Category name */}
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
                        {/* Category description */}
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

export default EditCategory;

EditCategory.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
