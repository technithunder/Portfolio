"use client";
import Avatar from "@component/avatar";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Typography, { H5, Small } from "@component/Typography";
import { Chip } from "@component/Chip";
import Spinner from "@component/Spinner";
import Link from "next/link";
interface Props {
  invoiceDetails: any;
  loading: boolean;
}
export default function InvoiceList({ invoiceDetails, loading }: Props) {

  const getColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "error";
      case "Accepted":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "";
    }
  };
  return (
    <>
      {loading ? (
        <FlexBox
          flex="1 1 100%"
          alignItems="center"
          justifyContent="center"
          width={"100%"}
        >
          <Spinner />
        </FlexBox>
      ) : (
        <>
          {invoiceDetails?.map((item) => (
            <TableRow my="1rem" padding="6px 18px" borderBottom="2px solid #D8E0E9">
              {/* <FlexBox flex="1 1 150px">
            <H5 my="0px" textAlign="left" fontWeight="400">{item.invoiceID}</H5>
          </FlexBox> */}

              <FlexBox flex="1 1 120px" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <H5 my="0px" textAlign="left" fontWeight="400">{item.itemID}</H5>
              </FlexBox>
              <Link href={`/product/${item.itemID}`} key={item.id}>

                <FlexBox flex="2.5 2.5 300px" alignItems="center">
                  <Avatar src={`https://orderoasis.net/Banner_images/${item.itemID}.jpg`}
                    size={36} />
                  <Typography textAlign="left" ml="12px">{item.itemDescription}</Typography>
                </FlexBox>
              </Link>


              <FlexBox flex="1.2 1.2 120px" justifyContent="center">
                <H5 my="0px" textAlign="left" fontWeight="400">${item.unitPrice}</H5>
              </FlexBox>

              {/* <FlexBox flex="1.3 1.3 140px" justifyContent="center">
            <Chip p="0.25rem 1rem" bg={`${getColor(item.status)}.light`}>
              <Small color={`${getColor(item.status)}.main`}>{item.status}</Small>
            </Chip>
          </FlexBox> */}
            </TableRow>
          ))}
        </>
      )}
    </>
  );
}
