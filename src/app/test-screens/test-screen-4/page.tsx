'use client';

import { Box, TextField, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

const page = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <UploadBox
        maxFiles={1}
        maxSize={5242880}
        accept={{
          'image/jpeg': [],
          'image/png': [],
        }}
        placeholder={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '125px',
              flexDirection: 'column',
            }}
          >
            <Iconify icon="uil:upload" style={{ color: '#8688A3' }} />
            <span style={{ color: '#8688A3', fontSize: '.7rem' }}>Upload Image</span>
          </Box>
        }
        sx={{ flexGrow: 1, height: '125px', width: '125px', py: 2.5, mb: 3 }}
      />
      <div>
        <Typography
          mt="0px"
          component="p"
          variant="subtitle2"
          sx={{ opacity: 0.7, fontSize: '.9rem' }}
        >
          Maximum size is 5mb
        </Typography>
        <Typography
          mt="0px"
          component="p"
          variant="subtitle2"
          sx={{ opacity: 0.7, fontSize: '.9rem' }}
        >
          You can use these extensions PNG or JPG
        </Typography>
      </div>
    </div>
    <TextField
      id="outlined-basic"
      sx={{ width: '100%' }}
      label="Primary Color"
      variant="outlined"
    />
  </div>
);

export default page;
