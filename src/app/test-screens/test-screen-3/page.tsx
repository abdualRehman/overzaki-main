'use client';

import { TextField, Typography } from '@mui/material';
import React from 'react';
import { RHFTextField } from 'src/components/hook-form';

const page = () => (
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
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography component="p" noWrap variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem' }}>
        English Name
      </Typography>

      <TextField sx={{ width: '50%' }} />
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
      <Typography component="p" noWrap variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem' }}>
        Arabic Name (Optional)
      </Typography>

      <TextField sx={{ width: '50%' }} />
    </div>
  </div>
);

export default page;
