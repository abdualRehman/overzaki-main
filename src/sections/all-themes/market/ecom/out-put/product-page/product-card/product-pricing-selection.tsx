import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Sketch from '@uiw/react-color-sketch';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';

const ProductPricingSection = () => {
  const [isItemPrice, setIsItemPrice] = useState(false);
  const [isItemPriceDiscount, setIsItemPriceDiscount] = useState(false);
  const [isCurrency, setIsCurrency] = useState(false);
  const customPresets = [
    '#FF5733', // Reddish Orange
    '#33FF57', // Greenish Yellow
    '#3366FF', // Vivid Blue
    '#FF33FF', // Electric Purple
    '#33FFFF', // Cyan
    '#FF3366', // Pink
    '#6633FF', // Blue Purple
    '#FF9900', // Orange
    '#00FF99', // Spring Green
    '#9966FF', // Royal Purple
    '#99FF33', // Lime Green
    '#FF66CC', // Pastel Pink
    '#66FF33', // Bright Lime
    '#FF6600', // Bright Orange
    '#FF99CC', // Light Pink
    '#3399FF', // Sky Blue
    '#FFCC00', // Gold
    '#33CC66', // Jade
    '#33FF57', // Greenish Yellow
    '#3366FF', // Vivid Blue
  ];
  return (
    <Accordion>
      <AccordionSummary
        sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
        expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle1">Pricing Section</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Item Price</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Stack mb="10px" direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" fontWeight={900}>
                    Show Item Price
                  </Typography>
                  <Switch
                    size="medium"
                    checked={isItemPrice}
                    onChange={() => setIsItemPrice((pv) => !pv)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
                {/* If item price is selected then styling part comes */}
                {isItemPrice && (
                  <Stack>
                    <Stack
                      mb="10px"
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption" fontWeight={900}>
                        Price text bold
                      </Typography>
                      <Switch size="medium" inputProps={{ 'aria-label': 'controlled' }} />
                    </Stack>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Text Color
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                      </Stack>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Text Color (Dark)
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                      </Stack>
                    </Box>
                  </Stack>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Accordion>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Discount Price</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Stack mb="10px" direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" fontWeight={900}>
                  Show Item Price Discount
                </Typography>
                <Switch
                  size="medium"
                  checked={isItemPriceDiscount}
                  onChange={() => setIsItemPriceDiscount((pv) => !pv)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              {isItemPriceDiscount && (
                <Box>
                  <Box sx={{ width: '100%', my: 2 }}>
                    <Typography variant="caption" color="#8688A3">
                      Text Design
                    </Typography>
                    <RadioGroup row>
                      <FormControlLabel
                        value="lineThrough"
                        control={<Radio size="medium" />}
                        sx={{ textDecoration: 'line-through' }}
                        label="Line Through Price"
                      />
                    </RadioGroup>
                  </Box>
                  <Stack
                    mb="10px"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="caption" fontWeight={900}>
                      Bold
                    </Typography>
                    <Switch size="medium" inputProps={{ 'aria-label': 'controlled' }} />
                  </Stack>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="#8688A3">
                      Discount Text Color
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                    </Stack>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="#8688A3">
                      Discount Text Color (Dark)
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                    </Stack>
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Currency</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Stack mb="10px" direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" fontWeight={900}>
                  Show Currency Symbol or Code
                </Typography>
                <Switch
                  size="medium"
                  checked={isCurrency}
                  onChange={() => setIsCurrency((pv) => !pv)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              {isCurrency && (
                <Box>
                  <RadioGroup row>
                    <FormControlLabel
                      value="lineThrough"
                      control={<Radio size="medium" />}
                      label="$ (USD)"
                    />
                    <FormControlLabel
                      value="lineThrough"
                      control={<Radio size="medium" />}
                      label="£ (Pounds)"
                    />
                    <FormControlLabel
                      value="lineThrough"
                      control={<Radio size="medium" />}
                      label="€ (Euro)"
                    />
                  </RadioGroup>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    variant="h6"
                    color="#8688A3"
                  >
                    or
                  </Typography>
                  <Box>
                    <Box
                      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}
                    >
                      <Typography variant="caption" color="#8688A3">
                        Currency Code
                      </Typography>

                      <TextField variant="filled" type="text" placeholder="i.e. KWD" />
                    </Box>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="#8688A3">
                      Currency Color
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                    </Stack>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="#8688A3">
                      Currency Color (Dark)
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                    </Stack>
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
};

export default ProductPricingSection;
