import React, { useState } from 'react';
import {
  Typography,
  Box,
  Stack,
  Switch,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

// ----------------------------------------------------------------------

interface PersonalProps {
  themeConfig: {
    productPageFilterShow: boolean;
    productPageFilterStyle: string;
    // Add other themeConfig properties as needed
  };
  handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
  mobile?: boolean;
}

export default function ProductPageFiltersDealer({
  themeConfig,
  handleThemeConfig,
  mobile = false,
}: PersonalProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleThemeConfig('productPageFilterShow', event.target.checked);
  const [filteringBasedOn, setFilteringBasedOn] = useState('price');
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  return (
    <Box>
      <Divider sx={{ borderWidth: '1px', borderColor: '#F4F4F4', my: '20px' }} />
      <Box>
        <Stack mb="10px" direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" maxWidth="155px" fontWeight={900}>
            Show filter categories on the page
          </Typography>
          <Switch
            checked={themeConfig.productPageFilterShow}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Stack>

        <Typography variant="caption" color="#8688A3">
          Allow customers to Filter for products
        </Typography>
      </Box>
      <Divider sx={{ borderWidth: '1px', borderColor: '#F4F4F4', my: '20px' }} />
      {themeConfig.productPageFilterShow && (
        <Box>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width={'100%'}
            >
              <Typography variant="caption" sx={{ fontWeight: 900 }}>
                Enable Sorting
              </Typography>
              <Switch
                checked={isSortingEnabled}
                onChange={() => setIsSortingEnabled((pv) => !pv)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Stack>
            {isSortingEnabled && (
              <Stack>
                <Box sx={{ width: '100%', my: 2 }}>
                  <Typography variant="caption" color="#8688A3">
                    Based on
                  </Typography>
                  <RadioGroup
                    row
                    value={filteringBasedOn}
                    onChange={(event: any) => setFilteringBasedOn(event.target.value)}
                  >
                    <FormControlLabel
                      value="best-selling"
                      control={<Radio size="medium" />}
                      label="Best Selling"
                    />
                    <FormControlLabel
                      value="price"
                      control={<Radio size="medium" />}
                      label="Price"
                    />
                    <FormControlLabel
                      value="reviews"
                      control={<Radio size="medium" />}
                      label="Reviews"
                    />
                  </RadioGroup>
                </Box>

                {filteringBasedOn === 'best-selling' && (
                  <Stack>
                    <Typography variant="subtitle1">Best Selling</Typography>
                    <RadioGroup row>
                      <FormControlLabel
                        value="low-to-high"
                        control={<Radio size="medium" />}
                        label="Low To High"
                      />

                      <FormControlLabel
                        value="high-to-low"
                        control={<Radio size="medium" />}
                        label="High To Low"
                      />
                    </RadioGroup>
                  </Stack>
                )}
                {filteringBasedOn === 'price' && (
                  <Stack>
                    <Typography variant="subtitle1">Price</Typography>
                    <RadioGroup row>
                      <FormControlLabel
                        value="low-to-high"
                        control={<Radio size="medium" />}
                        label="Low To High"
                      />

                      <FormControlLabel
                        value="high-to-low"
                        control={<Radio size="medium" />}
                        label="High To Low"
                      />
                    </RadioGroup>
                  </Stack>
                )}
                {filteringBasedOn === 'reviews' && (
                  <Stack>
                    <Typography variant="subtitle1">Reviews</Typography>
                    <RadioGroup row>
                      <FormControlLabel
                        value="low-to-high"
                        control={<Radio size="medium" />}
                        label="Low To High"
                      />

                      <FormControlLabel
                        value="high-to-low"
                        control={<Radio size="medium" />}
                        label="High To Low"
                      />
                    </RadioGroup>
                  </Stack>
                )}
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
