import React, { useState } from "react";
import { TablePagination, Skeleton, Box } from "@mui/material";
import PropTypes from "prop-types";

const TanstackTablePagination = ({
  table,
  isLoading,
  pageIndex,
  pageSize,
  pageCount,
}) => {
  const [page, setPage] = useState(pageIndex);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const handleChangePage = (_, newPage) => {
    table.setPageIndex(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    const pageSize = parseInt(event.target.value, 10);
    table.setPageSize(pageSize);
    table.setPageIndex(0);
    setRowsPerPage(pageSize);
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Skeleton height={40} width={120} />
      </Box>
    );
  }

  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 50]}
      component="div"
      labelRowsPerPage="Lignes par page :"
      labelDisplayedRows={({ from, to, count }) => {
        return `${from}–${to} de ${count !== -1 ? count : `plus de ${to}`}`;
      }}
      count={pageCount}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default TanstackTablePagination;

TanstackTablePagination.propTypes = {
  table: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number,
};
