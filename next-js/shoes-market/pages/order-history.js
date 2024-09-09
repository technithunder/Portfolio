import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@/src/components/Button";
import moment from "moment/moment";
import Tracking from "@/src/components/Tracking";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { trakingOrder } from "@/src/api";
import Layout from "@/src/components/Layout";
import { useSelector } from "react-redux";

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
  return (
    <>
      <TableRow {...otherProps}>{children}</TableRow>
      <TableRow>
        <TableCell padding="checkbox" />
        {expandComponent}
      </TableRow>
    </>
  );
};

const OrderHistory = () => {
  const [trackingId, setTrackingId] = useState();
  const [trackingData, setTrackingData] = useState();

  let currency = useSelector(state => state.content.currency);

  const handleTrackOrder = () => {
    trakingOrder({ trackingId: trackingId })
      .then((res) => setTrackingData(res.data))
      .catch((e) => console.log(e));
  };

  return (
    <Layout headTitle={"Order History"}>
      <Container>
        <Stack display="flex" alignItems="center" justifyContent="center">
          <Typography mt={2} variant="h3">
            Track Your Order
          </Typography>
          <Stack mt={4} direction={{ sm: "column", md: "row" }} spacing={2}>
            <TextField
              size="small"
              label="Tracking ID"
              variant="outlined"
              type="text"
              inputProps={{ maxLength: 14 }}
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <Button sx={{ mt: 2 }} onClick={handleTrackOrder}>
              Track Order
            </Button>
          </Stack>
        </Stack>
        {trackingData && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width="20%">Title</TableCell>
                  <TableCell width="15%" align="right">
                    Size
                  </TableCell>
                  <TableCell width="15%" align="right">
                    Quantity
                  </TableCell>
                  {JSON.parse(trackingData?.product)[0].attribute !== "0" && (
                    <TableCell width="15%" align="right">
                      Color
                    </TableCell>
                  )}
                  <TableCell width="10%" align="right">
                    SKU ID
                  </TableCell>
                  <TableCell width="15%" align="right">
                    Date
                  </TableCell>
                  <TableCell width="15%" align="right">
                    Price
                  </TableCell>
                  <TableCell width="10%" align="right">
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {JSON.parse(trackingData?.product).map((e, index) => {
                  return (
                    <ExpandableTableRow
                      key={e}
                      expandComponent={
                        <TableCell colSpan={5}>
                          <Tracking time={e?.createdAt} />
                        </TableCell>
                      }
                    >
                      <TableCell component="th" scope="row">
                        {e?.product.title}
                      </TableCell>

                      <TableCell align="right">{e?.size}</TableCell>
                      <TableCell align="right">{e?.quantity}</TableCell>
                      {e?.attribute !== "0" && (
                        <TableCell align="right">{e?.attribute}</TableCell>
                      )}
                      <TableCell align="right">{e?.product.skuId}</TableCell>
                      <TableCell align="right">
                        {moment(e.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="right">
                        {currency}
                        {e?.product.salePrice}
                      </TableCell>
                      <TableCell align="right">
                        {currency}
                        {e?.subTotal}
                      </TableCell>
                    </ExpandableTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};

export default OrderHistory;
