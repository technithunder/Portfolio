import { Box, Typography, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const CustomNoRowsOverlay = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        minHeight: 120,
      }}
    >
      <Typography variant="h6" color="gray">
        No Data Found
      </Typography>
    </Box>
  );
};

const AssignedStaffTable = ({ loading, data, columns }) => {
  return (
    <Box sx={{ width: "100%" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={data && data.length > 0 ? data : []}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          hideFooter
          sx={{
            border: "none",
            backgroundColor: "#fff",
          }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      )}
    </Box>
  );
};

export default AssignedStaffTable;
