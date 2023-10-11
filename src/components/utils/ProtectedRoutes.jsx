import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { login, logout } from "../../store/features/authSlice.js";
import { isTokenExpired } from "../../utils/auth.js";
import { Loading } from "../ui/informative";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const idToken = localStorage.getItem("id-token");
    const refreshToken = localStorage.getItem("refresh-token");
    const expiresIn = localStorage.getItem("expires-in");

    if (idToken && refreshToken && expiresIn) {
      if (isTokenExpired(idToken, refreshToken, expiresIn)) {
        dispatch(logout());
        navigate("/");
      } else {
        const parsedUserData = JSON.parse(
          localStorage.getItem(process.env.LOCAL_STORAGE_KEYS),
        );
        dispatch(login(parsedUserData));
      }
    } else {
      navigate("/");
    }

    setIsLoading(false);
  });

  return isLoading ? <Loading /> : children;
};

export default ProtectedRoutes;

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};
