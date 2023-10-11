import React, { useMemo } from "react";
import { Typography, Stack, Avatar } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { formatToISODate } from "../../utils/times";
import { BSMenu } from "../ui/control";
import { useSelector } from "react-redux";

const useUserColumn = (handleOpenEditUser, handleOpenDeleteUser) => {
  const { error, sasTokens } = useSelector(state => state.sasToken);
  return useMemo(
    () => [
      {
        id: "displayName",
        header: "Prenom et nom",
        accessorFn: row => [row.photoUrl, row.displayName],
        cell: info => {
          const values = info.getValue();
          return (
            <>
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Avatar
                  src={error ? null : `${values[0]}?${sasTokens.fileStorage}`}
                  alt={values[1]}
                />
                <Typography variant="body1" color="initial">
                  {values[1]}
                </Typography>
              </Stack>
            </>
          );
        },
      },
      {
        if: "email",
        header: "Courriel",
        accessorKey: "email",
        cell: info => (
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <MailOutlineIcon color="primary" />
            <Typography variant="body1" color="initial">
              {info.getValue()}
            </Typography>
          </Stack>
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
        accessorFn: row => [row._id, row.displayName],
        cell: info => {
          const data = info.getValue();
          const buttons = [
            {
              label: "Modifier",
              onClick: () => handleOpenEditUser(data[0]),
              color: "primary",
              fullWidth: true,
            },
            {
              label: "Supprimer",
              onClick: () => handleOpenDeleteUser(data[0]),
              color: "error",
              fullWidth: true,
            },
          ];
          return <BSMenu buttons={buttons} />;
        },
      },
    ],
    [handleOpenEditUser, handleOpenDeleteUser],
  );
};

export default useUserColumn;
