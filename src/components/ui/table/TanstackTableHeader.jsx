import React from "react";
import PropTypes from "prop-types";
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow, TableHead } from "@mui/material";

const TanstackTableHeader = ({ table }) => (
  <TableHead sx={{ border: "none" }}>
    {table.getHeaderGroups().map(headerGroup => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <TableCell
            padding="none"
            sx={{ padding: "8px 8px", fontWeight: "600", border: "none" }}
            variant="head"
            key={header.id}
          >
            {header.isPlaceholder
              ? "--"
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableHead>
);

export default TanstackTableHeader;

TanstackTableHeader.propTypes = {
  table: PropTypes.object,
};
