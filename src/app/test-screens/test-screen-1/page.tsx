/* eslint-disable no-nested-ternary */

'use client';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

import { Icon } from '@iconify/react';

const page = () => {
  const data = [
    {
      icon: 'ic:baseline-laptop',
      title: 'Websites',
    },
    {
      icon: 'clarity:mobile-solid',
      title: 'Apps',
    },
    {
      icon: 'gridicons:speaker',
      title: 'Marketing',
    },
    {
      icon: 'lets-icons:paper-fill',
      title: 'Invoices',
    },
  ];
  return (
    <Box sx={{ height: '100%', transition: 'all .5', paddingBottom: '30px', width: '100%' }}>
      <Typography variant="h3" sx={{ textAlign: 'center', padding: { xs: '5px', sm: '13px' } }}>
        What do you want me to do?
      </Typography>

      <Grid container spacing={2} mt={2} px={2}>
        {data.map((item, indx) => (
          <Grid item key={indx} xs={6} sm={4} md={3}>
            <Box
              sx={{
                width: '100%',
                height: '120px',
                backgroundColor: 'rgb(134, 136, 163,.09)',
                borderRadius: '16px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                flexDirection: 'column',
                transition: 'all .5s',
                cursor: { xs: 'default', sm: 'pointer' },
                '&:hover': {
                  backgroundColor: 'rgb(27, 252, 182)',
                },
              }}
            >
              <Icon width={24} icon={item.icon} />
              <Typography
                component="h5"
                variant="subtitle2"
                sx={{ whiteSpace: 'pre-line', fontSize: '14px', fontWeight: 700 }}
              >
                {item.title}{' '}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default page;
