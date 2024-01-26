'use client';
import React from 'react';
import AppOrders from '../../app/app-orders';
import AppHolder from '../../app/app-holder';
import { Grid } from '@mui/material';

const BestSellingView = () => {
  return (
    <Grid xs={12}>
      <AppHolder title="Best Selling Items" subtitle="All Best Selling Items">
        {[
          {
            idNo: '#425453697',
            datetime: '22/03/2022, 3:54 PM',
            name: 'Zain Abdallah',
            status: 'Completed',
            amount: 120,
            itemCount: 2,
            country: 'default',
          },
          {
            idNo: '#425453697',
            datetime: '22/03/2022, 3:54 PM',
            name: 'Zain Abdallah',
            status: 'Pending',
            amount: 120,
            itemCount: 2,
            country: 'default',
          },
          {
            idNo: '#425453697',
            datetime: '22/03/2022, 3:54 PM',
            name: 'Zain Abdallah',
            status: 'Accepted',
            amount: 120,
            itemCount: 2,
            country: 'default',
          },
          {
            idNo: '#425453697',
            datetime: '22/03/2022, 3:54 PM',
            name: 'Zain Abdallah',
            status: 'Rejected',
            amount: 120,
            itemCount: 2,
            country: 'default',
          },
        ].map((item, indx) => (
          <AppOrders
            elevation={7}
            key={indx}
            idNo={item.idNo}
            datetime={item.datetime}
            name={item.name}
            status={item.status}
            amount={item.amount}
            itemCount={item.itemCount}
            country={item.country}
          />
        ))}
      </AppHolder>
    </Grid>
  );
};

export default BestSellingView;
