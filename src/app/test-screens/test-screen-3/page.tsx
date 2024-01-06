'use client';

import { TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Link from 'next/link';

const page = () => {
  const [names, setNames] = useState<any>({ engName: '', arName: '' });

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" sx={{ textAlign: 'center', padding: { xs: '5px', sm: '13px' } }}>
        What is the name of your business?
      </Typography>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          component="p"
          noWrap
          variant="subtitle2"
          sx={{ opacity: 0.7, fontSize: '.9rem' }}
        >
          English Name
        </Typography>

        <TextField
          name="engName"
          onChange={(e) => setNames((prev: any) => ({ ...prev, [e.target.name]: e.target.value }))}
          sx={{ width: '50%' }}
        />
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'start',
          justifyContent: 'start',
        }}
      >
        <Typography
          component="p"
          noWrap
          variant="subtitle2"
          sx={{ opacity: 0.7, fontSize: '.9rem' }}
        >
          Arabic Name (Optional)
        </Typography>

        <TextField
          onChange={(e) => setNames((prev: any) => ({ ...prev, [e.target.name]: e.target.value }))}
          name="arName"
          sx={{ width: '50%' }}
        />
      </div>
      {names?.engName !== '' && (
        <Link
          href="/test-screens/test-screen-4"
          style={{
            color: 'black',
            width: '100%',
            display: names?.engName ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowForwardIosOutlinedIcon
            sx={{
              fontSize: 40,
              backgroundColor: '#1BFDB7',
              borderRadius: '50%',
              padding: '7px',
              position: 'fixed',
              bottom: '20px',
            }}
          />
        </Link>
      )}
    </div>
  );
};

export default page;
