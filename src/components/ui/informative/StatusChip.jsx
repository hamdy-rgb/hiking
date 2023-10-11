import React from "react";
import { Chip } from "@mui/material";
import PropTypes from "prop-types";

const statusColors = {
  unsuccessful: "#FF5733",
  incomplete: "#FFD700",
  successful: "#008000",
  started: "#3498db",
  ended: "#9b59b6",
  "pending-review": "#e74c3c",
};

const englishToFrenchStatus = {
  unsuccessful: "Echoué",
  incomplete: "Incomplet",
  successful: "Réussi",
  started: "Démarré",
  ended: "Terminé",
  "pending-review": "En Attente",
};

const translateToFrench = status => englishToFrenchStatus[status] || status;

const StatusChip = ({ status }) => {
  const translatedStatus = translateToFrench(status);
  const color = statusColors[status] || "#000";

  return (
    <Chip
      label={translatedStatus}
      sx={{ backgroundColor: color, color: "white", minWidth: "85px" }}
    />
  );
};

export default StatusChip;

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
};
