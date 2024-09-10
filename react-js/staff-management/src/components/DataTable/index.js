import { forwardRef, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Slide,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  styled
} from '@mui/material';
import PropTypes from 'prop-types';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  LicenseInfo
} from '@mui/x-data-grid-pro';
import BulkActions from 'src/content/User/User1/BulkActions';

const DialogWrapper = styled(Dialog)(
  () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
       background: ${theme.colors.error.main};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.dark};
       }
      `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (users, query, filters) => {
  return users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name', 'username'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.role && user.role !== filters.role) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && user[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
};

const DataTable = ({ users, label }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    role: null
  });
  const [checked, setChecked] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const isEnable = localStorage.getItem('row');
    if (isEnable !== null) {
      setChecked(isEnable === 'true');
    }
  }, []);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  LicenseInfo.setLicenseKey(
    'bb1cfd0d033309691d9356670ea353b2Tz04MDA1MSxFPTE3MzM0NTU5NTIwMDAsUz1wcm8sTE09cGVycGV0dWFsLEtWPTI='
  );

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredUsers = applyFilters(users, query, filters);
  const paginatedUsers = applyPagination(filteredUsers, page, limit);

  const [toggleView] = useState('table_view');

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('Record has been deleted successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handleSelectionChange = (selection) => {
    setSelectedIds(selection);
  };

  const handleDeleteSelected = () => {
    console.log('Delete selected:', selectedIds);
  };

  const CustomToolbar = (props) => (
    <Stack direction="row" spacing={1} my={2}>
      <GridToolbarContainer>
        <GridToolbarExport {...props} />
      </GridToolbarContainer>
      <Box>
        {selectedIds.length > 0 && (
          <BulkActions onClick={handleDeleteSelected} />
        )}
      </Box>
    </Stack>
  );

  return (
    <>
      {toggleView === 'table_view' && (
        <Card>
          <Box
            flex={1}
            p={2}
            display={{ xs: 'block', md: 'flex' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              sx={{
                mb: { xs: 2, md: 0 }
              }}
            >
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder={t('Search here')}
                value={query}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Box>
            <TablePagination
              component="div"
              count={filteredUsers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Box>

          <Divider />

          {paginatedUsers.length === 0 ? (
            <>
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {t("We couldn't find any records  matching your search criteria")}
              </Typography>
            </>
          ) : (
            <>
              <DataGridPro
                checkboxSelection
                disableRowSelectionOnClick
                selectionModel={selectedIds}
                onRowSelectionModelChange={handleSelectionChange}
                columns={[
                  {
                    field: 'username',
                    headerName: `${label}`,
                    flex: 6,
                    renderHeader: (params) => (
                      <Typography variant="h5">
                        {params.colDef.headerName}
                      </Typography>
                    )
                  },

                  {
                    field: 'id',
                    headerName: 'Actions',
                    flex: 1,
                    disableColumnMenu: true,
                    hideSortIcons: true,
                    sortingOrder: false,
                    renderHeader: (params) => (
                      <Typography variant="h5">
                        {params.colDef.headerName}
                      </Typography>
                    ),
                    renderCell: () => (
                      <Box>
                        <Tooltip title={t('Edit')} arrow>
                          <IconButton
                            component={RouterLink}
                            to={`${location.pathname}/add`}
                            color="primary"
                          >
                            <LaunchTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')} arrow>
                          <IconButton
                            onClick={handleConfirmDelete}
                            color="error"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )
                  }
                ]}
                rows={paginatedUsers.map((user) => ({
                  ...user,
                  id: user.id.toString()
                }))}
                pageSize={limit}
                rowReordering={checked}
                page={page}
                onPageChange={(newPage) => handlePageChange(null, newPage)}
                components={{
                  Toolbar: CustomToolbar
                }}
              />
            </>
          )}
        </Card>
      )}

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <Typography
            align="center"
            sx={{
              py: 2,
              px: 3
            }}
            variant="h3"
          >
            {t('Are you sure you want to delete this record')}?
          </Typography>

          <Box>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

DataTable.propTypes = {
  users: PropTypes.array.isRequired
};

DataTable.defaultProps = {
  users: []
};

export default DataTable;
