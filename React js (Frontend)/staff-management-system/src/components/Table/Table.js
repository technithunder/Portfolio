import React, { forwardRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  InputAdornment,
  Slide,
  Stack,
  TablePagination,
  TextField,
  Typography,
  styled,
  CircularProgress
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  LicenseInfo
} from '@mui/x-data-grid-pro';
// import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import BulkActions from 'src/content/User/User1/BulkActions';
import ProgressBar from '../ProgressBar';

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

const DataTable = ({
  selectionModel,
  onRowSelectionModelChange,
  handleDeleteSelected,
  openConfirmDelete,
  closeConfirmDelete,
  handleDeleteCompleted,
  columns,
  onRowsPerPageChange,
  onPageChange,
  onQueryChange,
  query,
  page,
  limit,
  deleteLoading,
  loading,
  data,
  totalRecords,
  exportFields
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isEnable = localStorage.getItem('row');
    if (isEnable !== null) {
      setChecked(isEnable === 'true');
    }
  }, []);

  LicenseInfo.setLicenseKey(
    'bb1cfd0d033309691d9356670ea353b2Tz04MDA1MSxFPTE3MzM0NTU5NTIwMDAsUz1wcm8sTE09cGVycGV0dWFsLEtWPTI='
  );

  const CustomToolbar = (props) => (
    <Stack direction="row" spacing={1} my={2}>
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{
            fields: exportFields
          }}
          {...props}
        />
      </GridToolbarContainer>
      <Box>
        {selectionModel?.length > 0 ? (
          <BulkActions onClick={handleDeleteSelected} />
        ) : (
          ''
        )}
      </Box>
    </Stack>
  );

  const count = Number.isNaN(Number(totalRecords)) ? 0 : Number(totalRecords);

  return (
    
    <>
    {count!==0?
    <><Card>
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
              onChange={onQueryChange}
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
            count={count}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
        <Divider />
        {loading ? (
          <>
            <ProgressBar />
          </>
        ) : (
          <>
            {data?.length === 0 ? (
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
                  {t(
                    "We couldn't find any records  matching your search criteria"
                  )}
                </Typography>
              </>
            ) : (
              <>
                <DataGridPro
                   sx={{
                    "& .MuiDataGrid-columnHeaderTitleContainer": {
                      whiteSpace: "normal",
                      lineHeight: "normal",
                      textAlign:"center"
                    },
                    
                  }}
                  
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={onRowSelectionModelChange}
                  columns={columns}
                  scrollbarSize={500}
              
                  rows={data?.map((user, index) => ({
                    ...user,
                    id: index.toString()
                  }))}
                  pageSize={limit}
                  rowReordering={checked}
                  page={page}
                  onPageChange={onPageChange}
                  components={{
                    Toolbar: CustomToolbar
                  }}
                  disableExporting={false}
                />
              </>
            )}
          </>
        )}
      </Card>

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
              disabled={deleteLoading}
              startIcon={
                deleteLoading ? <CircularProgress size="1rem" /> : null
              }
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
      </DialogWrapper></>:
      <></>}
      
    </>
  );
};

export default DataTable;
