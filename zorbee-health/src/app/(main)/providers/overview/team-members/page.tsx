"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Menu, MenuItem, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import CommonTable from "@/components/CommonTable";
import Typography from "@mui/material/Typography";
import CommonCard from "@/components/Cards/Common";
import CommonInput from "@/components/CommonInput";
import CommonSelect from "@/components/CommonSelect";
import { teamMembersData } from "@/constants/teamembersData";

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const TeamMembers: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string | number | null>("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (action: string) => {
    console.log(`Action: ${action}`);
    router.push("/providers/overview/profile");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "view" },
    { label: "Pause account", value: "pause" },
    { label: "Remove account", value: "remove" },
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "User name", flex: 1, minWidth: 140 },
    { field: "permissons", headerName: "Permissons", flex: 1, minWidth: 140 },
    { field: "lastLogin", headerName: "Last login", flex: 1, minWidth: 140 },
    { field: "jobRole", headerName: "Job role", flex: 1, minWidth: 140 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      minWidth: 140,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={(event) => handleActionClick(event, params.row.id)}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              backgroundColor: "#f5f5f7",
              color: "#000",
              textTransform: "none",
              borderRadius: "8px",

              minWidth: "100px",
              height: "30px",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#e8e8ea",
              },
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              Select
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow === params.row.id}
            onClose={handleClose}
          >
            {actionItems.map((action, idx) => (
              <MenuItem
                key={idx}
                onClick={() => handleActionItemClick(action.value)}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <CommonCard>
        <Typography variant="h6" fontWeight={600}>
          Guernsey Chesire Home | Team members
        </Typography>
      </CommonCard>

      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        spacing={3}
        mt={4}
      >
        <CommonInput
          placeholder="Search users or carers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={<SearchIcon sx={{ fontSize: "18px", mr: 1 }} />}
          sx={{
            height: "30px",
            fontSize: "12px",
            "&.MuiOutlinedInput-root": {
              border: "1px solid #E2E6EB",
            },
            borderRadius: "8px",
            width: "100%",
          }}
        />
        <CommonSelect
          placeholder="Filters"
          value={filterValue}
          onChange={(value: string | number | null) => setFilterValue(value)}
          options={filterOptions}
          withFilter={true}
          sx={{ width: isMobile ? "100%" : 120, height: "30px" }}
        />
      </Stack>

      <Box mt={4}>
        <CommonTable column={columns} rows={teamMembersData} isPaginations />
      </Box>
    </Box>
  );
};

export default TeamMembers;
