import React from "react";
import { Typography, Link } from "@mui/material";
import BoxCentered from "../components/utils/BoxCentered";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <BoxCentered sx={{ flexDirection: "column", minHeight: "100vh" }}>
      <Typography variant="h2" gutterBottom>
        404 Non trouvé
      </Typography>
      <Typography variant="h6" gutterBottom>
        Oops! Il semblerait que vous soyez perdu.
      </Typography>
      <Typography variant="body1" gutterBottom>
        La page que vous recherchez n&apos;existe pas. Vous pouvez retourner à
        la{" "}
        <Link
          underline="none"
          variant="body1"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ cursor: "pointer" }}
        >
          Page précédente.
        </Link>
        .
      </Typography>
    </BoxCentered>
  );
};

export default NotFound;
