"use client";
import React from "react";
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
  Stack,
  Pagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NextImage from "next/image";

const StatusToggleButton = ({ status, onClick, loading }) => (
  <IconButton
    size="small"
    onClick={onClick}
    disabled={loading}
    sx={{
      padding: "4px",
      borderRadius: "50%",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: status === "Active" ? "#e8f5e9" : "#ffebee",
        transform: "scale(1.1)",
      },
    }}
  >
    {loading ? (
      <CircularProgress size={16} />
    ) : status === "Active" ? (
      <CheckCircleIcon
        sx={{
          color: "#2e7d32",
          fontSize: 18,
        }}
      />
    ) : (
      <CancelIcon
        sx={{
          color: "#c62828",
          fontSize: 18,
        }}
      />
    )}
  </IconButton>
);

const CommonTable = ({
  columns,
  data,
  loading,
  total,
  page,
  limit,
  onPageChange,
  onSortChange,
  sortBy,
  order,
  onRowClick,
  onStatusToggle,
  statusLoading = {},
  showCheckboxes = false,
  selected = [],
  onSelectAll,
  onSelectOne,
  emptyMessage = "No data found",
  stickyHeader = true,
  stickyFooter = true,
  actionButtons,
}) => {
  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <TableContainer
      sx={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        overflowX: "auto",
        maxHeight: stickyHeader ? "calc(100vh - 250px)" : "auto",
        position: "relative",
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
        },
      }}
    >
      <Table stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {showCheckboxes && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < data.length
                  }
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={onSelectAll}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell
                key={column.id}
                onClick={() =>
                  column.sortable &&
                  onSortChange(
                    column.id,
                    order === "ASC" && sortBy === column.id ? "DESC" : "ASC"
                  )
                }
                sx={{
                  cursor: column.sortable ? "pointer" : "default",
                  ...column.headerSx,
                }}
                align={column.align || "left"}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ...column.headerContentSx,
                  }}
                >
                  {column.label}
                  {column.sortable && (
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "18px",
                        ml: 0.5,
                        transform:
                          sortBy === column.id && order === "DESC"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  )}
                </Box>
              </TableCell>
            ))}
            {actionButtons && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">
                <CircularProgress size={20} />
              </TableCell>
            </TableRow>
          ) : data?.length > 0 ? (
            data.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  key={`${row.id}-${index}`}
                  selected={isItemSelected}
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                >
                  {showCheckboxes && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={(event) => onSelectOne(event, row.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    if (column.customRender) {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          {column.customRender(row)}
                        </TableCell>
                      );
                    }

                    if (column.id === "status") {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {row.status ? (
                              <>
                                {onStatusToggle && (
                                  <Tooltip
                                    title={`Click to make ${
                                      row.status === "Active"
                                        ? "Inactive"
                                        : "Active"
                                    }`}
                                  >
                                    <StatusToggleButton
                                      status={row.status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusToggle(row.id, row.status);
                                      }}
                                      loading={statusLoading[row.id]}
                                    />
                                  </Tooltip>
                                )}
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "12px" }}
                                >
                                  {row.status}
                                </Typography>
                              </>
                            ) : (
                              "-"
                            )}
                          </Box>
                        </TableCell>
                      );
                    }

                    if (
                      (column.id === "name" ||
                        column.id === "firstName" ||
                        column.id === "productName") &&
                      !column.disableAvatar
                    ) {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          <Box
                            sx={{ display: "flex", alignItems: "center" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.profilePic ? (
                              <NextImage
                                src={row.profilePic}
                                alt={row.name}
                                width={34}
                                height={34}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  marginRight: "10px",
                                }}
                              />
                            ) : (
                              <Avatar sx={{ width: 32, height: 32, mr: 1.5 }} />
                            )}

                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {row.name ||
                                  row?.firstName ||
                                  row?.productName ||
                                  "-"}
                              </Typography>
                              {row.email && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {row.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {row[column.id] || "-"}
                      </TableCell>
                    );
                  })}
                  {actionButtons && (
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {actionButtons(row)}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                sx={{ borderBottom: "none" }}
                colSpan={columns.length + 1}
              >
                <Box sx={{ py: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "25px",
                      textAlign: "center",
                    }}
                  >
                    {emptyMessage}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {stickyFooter && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2,
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            zIndex: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {total > 0
              ? `Showing ${(page - 1) * limit + 1}-${Math.min(
                  page * limit,
                  total
                )} from ${total} results`
              : "Showing 0-0 from 0 results"}
          </Typography>
          {total > 0 && (
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={onPageChange}
              color="primary"
            />
          )}
        </Stack>
      )}
    </TableContainer>
  );
};

export default CommonTable;
