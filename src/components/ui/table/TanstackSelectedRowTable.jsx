import React, { useMemo, useState, useEffect } from "react";
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

const TanstackSelectedRowTable = ({
  data,
  columns,
  isLoading,
  pageCount,
  manualPagination = false,
  setFetchDataOptions,
  getSelectedValues,
  initialValues = {},
}) => {
  const defaultData = useMemo(() => [], []);

  const [rowSelection, setRowSelection] = useState(initialValues);

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (manualPagination) {
      setFetchDataOptions({
        pageSize,
        pageIndex,
      });
    }
  }, [pageIndex, pageSize]);

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
    manualPagination,
    debugTable: true,
    state: {
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    getSelectedValues(table.getSelectedRowModel().flatRows);
  }, [rowSelection]);

  return (
    <TableContainer>
      <Table
        className="table"
        aria-label="table"
        sx={{
          borderCollapse: "separate",
          borderSpacing: "0px 5px",
          minWidth: isLoading && "55vw",
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

export default TanstackSelectedRowTable;

TanstackSelectedRowTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
  manualPagination: PropTypes.bool,
  setFetchDataOptions: PropTypes.func,
  getSelectedValues: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.bool),
};
