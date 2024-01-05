'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { Typography } from '@mui/material';

const layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Typography variant="h3" sx={{ padding: { xs: '5px', sm: '13px' } }}>
      Hello User 👋
    </Typography>
    <Typography variant="h3" sx={{ padding: { xs: '5px', sm: '13px' } }}>
      Overzaki Services
    </Typography>
    <div
      style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        gap: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Icon
          style={{ padding: '7px', background: 'gray', borderRadius: '50%' }}
          width={35}
          icon="iconamoon:restart-bold"
        />
        <img alt="" src="/Face.png" />
        <Icon
          style={{ padding: '7px', background: 'gray', borderRadius: '50%' }}
          width={35}
          icon="mingcute:volume-mute-fill"
        />
      </div>
      <img alt="" src="/Voice.png" />
      {children}
    </div>
  </>
);
export default layout;
