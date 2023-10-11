import React, { useReducer } from "react";
import { Container } from "@mui/material";
import PropTypes from "prop-types";
import { NoDataMessage, ErrorMessage } from "../../ui/informative";
import { DeleteCategory, EditCategory } from "./"; // Import the appropriate components for editing and deleting categories
import { useQuery } from "react-query";
import { TanstackTable } from "../../ui/table";
import api from "../../../utils/api.js";
import { useCategoryColumn } from "../../columns"; // Define columns for displaying category data

const initialState = {
  isEditCategoryModalOpen: false,
  editedCategoryId: "",

  isDeleteCategoryModalOpen: false,
  deletedCategoryId: "",
};

const getCategoriesData = async id => {
  const response = await api.get(`${process.env.HTTPS_ENDPOINT}/categories`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDIT_CATEGORY_MODAL_OPEN":
      return { ...state, isEditCategoryModalOpen: action.payload };
    case "SET_EDITED_CATEGORY_ID":
      return { ...state, editedCategoryId: action.payload };
    case "SET_DELETE_CATEGORY_MODAL_OPEN":
      return { ...state, isDeleteCategoryModalOpen: action.payload };
    case "SET_DELETED_CATEGORY_ID":
      return { ...state, deletedCategoryId: action.payload };
    default:
      return state;
  }
};

const ListCategories = ({ searchValue }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenEditCategory = id => {
    dispatch({ type: "SET_EDITED_CATEGORY_ID", payload: id });
    dispatch({ type: "SET_EDIT_CATEGORY_MODAL_OPEN", payload: true });
  };

  const handleOpenDeleteCategory = id => {
    dispatch({ type: "SET_DELETED_CATEGORY_ID", payload: id });
    dispatch({ type: "SET_DELETE_CATEGORY_MODAL_OPEN", payload: true });
  };

  const { data, isLoading, isError } = useQuery("categoriesData", () =>
    getCategoriesData(),
  );

  const columns = useCategoryColumn(
    handleOpenEditCategory,
    handleOpenDeleteCategory,
  );

  return (
    <Container>
      {isError ? (
        <ErrorMessage />
      ) : data && data?.categories.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.categories}
          columns={columns}
          isLoading={isLoading}
          pageCount={data?.totalCount}
        />
      )}

      <EditCategory
        id={state.editedCategoryId}
        open={state.isEditCategoryModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_EDIT_CATEGORY_MODAL_OPEN", payload: value })
        }
      />

      <DeleteCategory
        id={state.deletedCategoryId}
        open={state.isDeleteCategoryModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_DELETE_CATEGORY_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default ListCategories;

ListCategories.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
