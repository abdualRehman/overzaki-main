import React from 'react';
import {
  Typography,
  Box,
  Stack,
  Switch,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

// ----------------------------------------------------------------------

interface PersonalProps {
  themeConfig: {
    productPageSearch: boolean;
    // Add other themeConfig properties as needed
  };
  handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
  mobile?: boolean;
}

export default function ProductPageSearchDealer({
  themeConfig,
  handleThemeConfig,
  mobile = false,
}: PersonalProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleThemeConfig('productPageSearch', event.target.checked);

  return (
    <Box>
      <Divider sx={{ borderWidth: '1px', borderColor: '#F4F4F4', my: '20px' }} />
      <Stack>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" width={'100%'}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>
              Show Searchbar
            </Typography>
            <Switch
              checked={themeConfig.productPageSearch}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>
          <Typography variant="caption" color="#8688A3">
            Allow customers to search for products
          </Typography>
        </Box>
        {themeConfig.productPageSearch && (
          <Stack>
            <Box sx={{ width: '100%', my: 2 }}>
              <Typography variant="caption" color="#8688A3">
                Position
              </Typography>
              <RadioGroup
                row
                // value={appBar?.search?.position}
                // onChange={(event: any) =>
                //   handleChangeEvent('position', event.target.value, 'search')
                // }
              >
                <FormControlLabel value="left" control={<Radio size="medium" />} label="Left" />
                <FormControlLabel
                  value="center"
                  control={<Radio size="medium" />}
                  label="Center "
                />
                <FormControlLabel value="right" control={<Radio size="medium" />} label="Right" />
              </RadioGroup>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
