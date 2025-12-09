"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { Button, Grid2, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//relative path imports
import OverviewCard from "@/components/Cards/Overview";
import CommonTable from "@/components/CommonTable";
import Typography from "@mui/material/Typography";
import {
  getAllProvider,
  getProviderSummary,
  removeProvider,
  updateProvider,
} from "@/services/api/providerApi";

interface ActionItem {
  label: string;
  value: "view" | "pause" | "remove";
}

interface ProviderData {
  approvedBy: string | null;
  businessName: string | null;
  dateApproved: string | null;
  engagementRate: number;
  responseRate: number;
  typeOfProvider: string | null;
  userId: string;
  usersInfo: {
    firstName: string;
    lastName: string;
  };
  _id: string;
}

interface ProviderListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      providers: ProviderData[];
      totalDocs: number;
    };
  };
}

interface ProviderSummaryData {
  averageEngagementRate: number;
  averageResponseRate: number;
  totalProvider: number;
}

interface ProviderSummaryResponse {
  data: {
    data: ProviderSummaryData;
    success: boolean;
  };
}

interface ProviderAccountResponse {
  data: {
    success: boolean;
    message: string;
  };
}

interface RemoveProviderAccountResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const Overview: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [providerSummary, setProviderSummary] =
    useState<ProviderSummaryData | null>(null);
  const [rowsPerPage] = useState<number>(10);
  const router = useRouter();

  useEffect(() => {
    fetchAllProviders(currentPage);
    fetchProviderSummary();
  }, [currentPage]);

  const fetchAllProviders = async (page: number) => {
    setIsLoading(true);
    try {
      const response = (await getAllProvider({
        limit: rowsPerPage,
        page: page + 1,
      })) as ProviderListResponse;
      if (response?.data?.success) {
        setProviderData(response?.data?.data?.providers);
        setTotalItems(response?.data?.data?.totalDocs);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviderSummary = async () => {
    try {
      const response = (await getProviderSummary()) as ProviderSummaryResponse;
      if (response?.data?.success) {
        setProviderSummary(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowId);
  };

  const handleActionItemClick = (row: string, cindex: number) => {
    if (cindex === 0) {
      router.push(`/providers/overview/profile/${row}`);
    } else if (cindex === 1) {
      onPauseProviderAccount(row);
    } else if (cindex === 2) {
      onRemoveProviderAccount(row);
    }
    handleClose();
  };

  const onPauseProviderAccount = async (id: string) => {
    try {
      const response = (await updateProvider(id)) as ProviderAccountResponse;
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveProviderAccount = async (id: string) => {
    try {
      const response = (await removeProvider(
        id
      )) as RemoveProviderAccountResponse;
      if (response?.data?.success) {
        fetchAllProviders(currentPage);
        toast.success(response?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const actionItems: ActionItem[] = [
    { label: "View account", value: "view" },
    { label: "Pause account", value: "pause" },
    { label: "Remove account", value: "remove" },
  ];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Provider name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.firstName}&nbsp;
            {params?.row?.usersInfo?.lastName}
          </Typography>
        );
      },
    },
    {
      field: "dateApproved",
      headerName: "Date approved",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.dateApproved || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "approvedBy",
      headerName: "Approved by",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.approvedBy || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "typeOfProvider",
      headerName: "Provider category",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params?.row?.usersInfo?.typeOfProvider || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "responseRate",
      headerName: "Response rate",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "engagementRate",
      headerName: "Engagement rate",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
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
            {actionItems.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => handleActionItemClick(params?.row?._id, index)}
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
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={
              "/assets/svg/provider/overview/Kitchenware-Molds--Streamline-Ultimate.svg"
            }
            alt={"Kitchenware-Molds--Streamline-Ultimate"}
            title={"Total providers"}
            count={
              providerSummary?.totalProvider === 0
                ? "0"
                : providerSummary?.totalProvider
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={
              "/assets/svg/provider/overview/Rating-Star--Streamline-Ultimate.svg"
            }
            alt={"Kitchenware-Molds--Streamline-Ultimate"}
            title={"Total providers"}
            count={"Care home"}
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={"/assets/svg/provider/overview/messages_people.svg"}
            alt={"messages_people"}
            title={"Average response rate"}
            count={
              providerSummary?.averageResponseRate === 0
                ? "0"
                : providerSummary?.averageResponseRate
            }
          />
        </Grid2>
        <Grid2 size={{ md: 6, sm: 6, xs: 12, lg: 3, xl: 3 }}>
          <OverviewCard
            path={
              "/assets/svg/provider/overview/Monitor-Heart-Rate-Up--Streamline-Ultimate.svg"
            }
            alt={"Monitor-Heart-Rate-Up--Streamline-Ultimate"}
            title={"Average engagement rate"}
            count={
              providerSummary?.averageEngagementRate === 0
                ? "0"
                : providerSummary?.averageEngagementRate
            }
          />
        </Grid2>
      </Grid2>

      <Box mt={4}>
        <CommonTable
          column={columns}
          rows={providerData}
          isPaginations
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Overview;
