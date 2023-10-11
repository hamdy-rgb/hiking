import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { formatToISODate } from "../../utils/times";
import { BSMenu } from "../ui/control";

const useCategoryColumn = (
  handleOpenEditCategory,
  handleOpenDeleteCategory,
) => {
  return useMemo(
    () => [
      {
        id: "name",
        header: "Nom de la catégorie",
        accessorKey: "name",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue()}
          </Typography>
        ),
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        cell: info => (
          <Typography variant="body1" color="initial">
            {info.getValue() || "N/A"}
          </Typography>
        ),
      },
      {
        id: "createdAt",
        header: "Créé à",
        accessorKey: "createdAt",
        cell: info => (
          <Typography variant="body1" color="initial">
            {formatToISODate(info.getValue())}
          </Typography>
        ),
      },
      {
        id: "_id",
        header: "",
        accessorFn: row => [row._id],
        cell: info => {
          const data = info.getValue();
          const buttons = [
            {
              label: "Modifier",
              onClick: () => handleOpenEditCategory(data[0]),
              color: "primary",
              fullWidth: true,
            },
            {
              label: "Supprimer",
              onClick: () => handleOpenDeleteCategory(data[0]),
              color: "error",
              fullWidth: true,
            },
          ];
          return <BSMenu buttons={buttons} />;
        },
      },
    ],
    [handleOpenEditCategory, handleOpenDeleteCategory],
  );
};

export default useCategoryColumn;
