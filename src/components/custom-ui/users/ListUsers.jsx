import React, { useReducer } from "react";
import { Container } from "@mui/material";
import PropTypes from "prop-types";
import { NoDataMessage, ErrorMessage } from "../../ui/informative";
import { TanstackTable } from "../../ui/table";
import { DeleteUser, EditUser } from "./";
import { useQuery } from "react-query";
import api from "../../../utils/api.js";
import { useUserColumn } from "../../columns";

const initialState = {
  isEditUserModalOpen: false,
  editedUserId: "",

  isDeleteUserModalOpen: false,
  deletedUserId: "",
};

const getUsersData = async id => {
  const response = await api.get(`${process.env.HTTPS_ENDPOINT}/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDIT_USER_MODAL_OPEN":
      return { ...state, isEditUserModalOpen: action.payload };
    case "SET_EDITED_USER_ID":
      return { ...state, editedUserId: action.payload };
    case "SET_DELETE_USER_MODAL_OPEN":
      return { ...state, isDeleteUserModalOpen: action.payload };
    case "SET_DELETED_USER_ID":
      return { ...state, deletedUserId: action.payload };
    default:
      return state;
  }
};

const ListUsers = ({ searchValue }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenEditUser = id => {
    dispatch({ type: "SET_EDITED_USER_ID", payload: id });
    dispatch({ type: "SET_EDIT_USER_MODAL_OPEN", payload: true });
  };

  const handleOpenDeleteUser = id => {
    dispatch({ type: "SET_DELETED_USER_ID", payload: id });
    dispatch({ type: "SET_DELETE_USER_MODAL_OPEN", payload: true });
  };

  const { data, isLoading, isError } = useQuery("usersData", () =>
    getUsersData(),
  );

  const columns = useUserColumn(handleOpenEditUser, handleOpenDeleteUser);

  return (
    <Container>
      {isError ? (
        <ErrorMessage />
      ) : data && data?.users.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.users}
          columns={columns}
          isLoading={isLoading}
          pageCount={data?.totalCount}
        />
      )}

      <EditUser
        id={state.editedUserId}
        open={state.isEditUserModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_EDIT_USER_MODAL_OPEN", payload: value })
        }
      />

      <DeleteUser
        id={state.deletedUserId}
        open={state.isDeleteUserModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_DELETE_USER_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default ListUsers;

ListUsers.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
