'use client';

import React from 'react'
import OrderDetailsComponent from '@component/v2/OrderDetailsPage'
import { useParams } from 'next/navigation';
import MainLayout from '@component/v2/Layout';

const OrderDetails = () => {
  const { id } = useParams();
  return (
    <MainLayout>
      <OrderDetailsComponent id={id} />
    </MainLayout>
  )
}

export default OrderDetails
