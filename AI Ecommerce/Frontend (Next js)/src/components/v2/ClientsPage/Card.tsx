"use client";

import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Typography, { H4, H2, H5, H6, SemiSpan } from "@component/Typography";
import { ShopCard1Wrapper } from "./styles";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { selectCustomer } from "store/slices/customerSlice";
import { useRouter } from "next/navigation";
import { clearCart, removeGuiId } from "store/slices/cartSlice";

// =====================================================
type ShopCard1Props = {
  clientDetail: any;
};
// =====================================================

export default function Card({ clientDetail }: ShopCard1Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const manageClientSelection = () => {
    dispatch(selectCustomer(clientDetail));
    dispatch(clearCart());
    router.push('/store')
  }

  return (
    <ShopCard1Wrapper overflow="hidden" coverImgUrl={'/default-cover.jpg'}>
      <div className="black-box">
        <div style={{ display: 'flex', gap: '5px' }}>
          <H4 fontWeight="600" mb="8px">
            {clientDetail?.customerID}
          </H4>
          <div style={{
            width: '100%',
            position: 'relative'
          }}>
            <H4 fontWeight="600"
              mb="8px"
              maxWidth="100%"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: "ellipsis",
              }}
            >
              {clientDetail?.name}
            </H4>
          </div>
        </div>
        <FlexBox ml="30px">
          <Icon defaultcolor="currentColor" size="15px" mt={1}>
            map-pin-2
          </Icon>

          <SemiSpan color="white" ml="12px">
            {clientDetail?.addressLine1}  {clientDetail?.addressLine2}
            <H6>
              {clientDetail?.cityTown}, {clientDetail?.stateProvinceTerritory}
            </H6>
          </SemiSpan>
        </FlexBox>

        <FlexBox ml="28px">
          <Icon defaultcolor="currentColor" size="20px" mt={2}>
            edit
          </Icon>
          <H6 fontWeight={100} mt={2} mb="8px" ml="10px">
            <strong>Year to Date Sales:</strong> ${clientDetail?.ytdSalesAmt} <br />
            <strong>Last Sale Amount:</strong> ${clientDetail?.lastSaleAmt} <br />
            <strong>Last Sale Date:</strong> {moment(clientDetail?.lastSaleDate).format('MM/DD/YYYY')} <br />
            <strong>Last Payment Amount:</strong> ${clientDetail?.lastPaymentAmt}
          </H6>


        </FlexBox>
        {/* <FlexBox>
          <Icon defaultcolor="currentColor" size="15px" mt="4px">
            phone_filled
          </Icon>

          <SemiSpan color="white" ml="12px">
            {phone}
          </SemiSpan>
        </FlexBox> */}
      </div>

      <FlexBox pl="30px" pr="18px" justifyContent="space-between">
        <Avatar
          src='/assets/images/bannerman.jpg'
          size={64}
          mt="-32px"
          border="4px solid"
          borderColor="gray.100"
          backgroundColor="white" 
        />
        <IconButton my="0.25rem" onClick={manageClientSelection}>
          <Icon defaultcolor="auto">arrow-long-right</Icon>
        </IconButton>
      </FlexBox>
    </ShopCard1Wrapper>
  );
}
