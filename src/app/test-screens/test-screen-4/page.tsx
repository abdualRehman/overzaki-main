'use client';

import { Box, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const page = () => {
  const [primaryColor, setPrimaryColor] = useState<string>('');
  return (
    <div>
      <Typography variant="h3" sx={{ textAlign: 'center', padding: { xs: '5px', sm: '13px' } }}>
        Add a logo & color of your brand
      </Typography>
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
        onChange={(e) => setPrimaryColor(e.target.value)}
        variant="outlined"
      />
      {primaryColor !== '' && (
        <Link
          href="/test-screens/test-screen-5"
          style={{
            color: 'black',
            width: '100%',
            display: primaryColor ? 'flex' : 'none',
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
