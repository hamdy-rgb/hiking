import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../ui/informative";
import PropTypes from "prop-types";

const PublicRoutes = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const idToken = localStorage.getItem("id-token");
    const refreshToken = localStorage.getItem("refresh-token");
    const expiresIn = localStorage.getItem("expires-in");
    if (idToken && refreshToken && expiresIn) {
      navigate("/dashboard");
    }
    setIsLoading(false);
  }, []);

  return isLoading ? <Loading /> : children;
};

export default PublicRoutes;

PublicRoutes.propTypes = {
  children: PropTypes.node,
};
