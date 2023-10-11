import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  TableContainer,
  Skeleton,
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import PropTypes from "prop-types";
import { TanstackTableHeader, TanstackTablePagination } from ".";

const TanstackTableBody = ({ table, isLoading }) => {
  const columnCount = table.getAllColumns().length;
  const skeletons = Array.from({ length: 10 }, (_, i) => i);

  return (
    <TableBody>
      {!isLoading ? (
        table.getRowModel().rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell
                padding="none"
                sx={{ padding: "8px 8px", border: "none" }}
                variant="body"
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <>
          {skeletons.map((_, index) => (
            <TableRow key={index}>
              {skeletons.slice(0, columnCount).map(elm => (
                <TableCell sx={{ border: "none" }} variant="body" key={elm}>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      )}
    </TableBody>
  );
};

TanstackTableBody.propTypes = {
  table: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const TanstackTable = ({ data, columns, isLoading, pageCount }) => {
  const defaultData = useMemo(() => [], []);

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: false,
    debugTable: true,
    state: {
      pagination,
    },
  });

  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: 750,
          borderCollapse: "separate",
          borderSpacing: "0px 5px",
        }}
      >
        <TanstackTableHeader table={table} />
        <TanstackTableBody table={table} isLoading={isLoading} />
      </Table>
      <TanstackTablePagination
        table={table}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
      />
    </TableContainer>
  );
};

export default TanstackTable;

TanstackTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number,
};
