import React, { ChangeEvent, useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  Stack,
  Switch,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { VisuallyHiddenInput } from './logo-part';
import './style.css';
import Sketch from '@uiw/react-color-sketch';
import BannerSliderAccordion from './bannerSliderAccordion';

// ----------------------------------------------------------------------

interface BannerProps {
  themeConfig: {
    bannerShow: boolean;
    bannerImages: Array<string>;
    // Add other themeConfig properties as needed
  };
  handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
  mobile?: boolean;
}

export default function BannerDealer({
  themeConfig,
  handleThemeConfig,
  mobile = false,
}: BannerProps) {
  const [banner, setBanner] = useState<any>({});
  const [bannerType, setBannerType] = useState('');

  const handleActionsBanner =
    (action: string, location: number, arrayData: any) => (event: any) => {
      switch (action) {
        case 'delete':
          arrayData.splice(1, location);
          handleThemeConfig('bannerImages', arrayData);
          break;

        default:
          break;
      }
    };
  const [bannerSliderImages, setBannerSliderImages] = useState([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleThemeConfig('bannerShow', event.target.checked);

  const handleNewBanner = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = () => {
        handleThemeConfig(key, [...themeConfig.bannerImages, reader.result?.toString()]);
      };

      reader.readAsDataURL(file); // Read the file as data URL
    } else {
      alert('Please select a valid image file.');
    }
  };
  const handleNewSliderBanner = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = () => {
        [...bannerSliderImages, reader.result?.toString()];
      };

      reader.readAsDataURL(file); // Read the file as data URL
    } else {
      alert('Please select a valid image file.');
    }
  };

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
  const handleChangeEvent = (key: string, value: any, parent: any) => {};
  return (
    <Box pt="20px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ fontWeight: 900 }}>
          Show Banners Section
        </Typography>
        <Switch
          checked={themeConfig.bannerShow}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Stack>
      {themeConfig.bannerShow && (
        <Accordion>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Banner Type</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: '100%' }}>
              <Typography variant="caption" color="#8688A3">
                Banner Type
              </Typography>
              {/* <RadioGroup row value={banner?.search?.status || "true"} onChange={(event: any) => handleChangeEvent('status', event?.target?.value, 'search')}>
                    <FormControlLabel value="slider" control={<Radio size="medium" />} label="Slider" />
                    <FormControlLabel value="image" control={<Radio size="medium" />} label="Image" />
                    <FormControlLabel value="video" control={<Radio size="medium" />} label="Video" />
                </RadioGroup> */}
              <RadioGroup
                row
                //   value={logoObj?.position || 'center'}
                onChange={(event: any) => setBannerType(event.target.value)}
              >
                <FormControlLabel value="slider" control={<Radio size="medium" />} label="Slider" />
                <FormControlLabel value="image" control={<Radio size="medium" />} label="Image " />
              </RadioGroup>
            </Box>

            {/* <Typography variant='caption' component='p' color='#8688A3'>Sort</Typography>
            <TextField variant='filled' defaultValue={2} /> */}

            {bannerType === 'image' ? (
              <Box>
                <Box
                  sx={{
                    width: '100%',
                    height: '120px',
                    background: '#FFFFFF 0% 0% no-repeat padding-box',
                    border: '4px dashed #EBEBF0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    mt: '20px',
                  }}
                  component="label"
                >
                  <VisuallyHiddenInput
                    disabled={themeConfig.bannerImages.length == 1}
                    type="file"
                    onChange={handleNewBanner('bannerImages')}
                  />
                  <Iconify icon="ic:round-add" style={{ color: '#B2B3C5' }} />
                  <Typography variant="caption" component="p" color="#8688A3">
                    Add New Banner (Max 1)
                  </Typography>
                </Box>
                {themeConfig.bannerImages.map((img, index, self) => (
                  <Box
                    sx={{
                      width: '100%',
                      height: '120px',
                      borderRadius: '12px',
                      position: 'relative',
                      mt: '20px',
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'contain 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      '&:hover .actions': {
                        transition: 'all .5s',
                        visibility: 'visible',
                        opacity: 1,
                      },
                    }}
                  >
                    <Stack
                      justifyContent="flex-end"
                      px="10px"
                      maxWidth="300px"
                      direction="row"
                      alignItems="center"
                      spacing="15px"
                      className="actions"
                      sx={{
                        visibility: 'hidden',
                        opacity: 0,
                        background: 'transparent',
                        position: 'absolute',
                        top: '11px',
                        right: 0,
                        height: '35px',
                      }}
                    >
                      <Iconify
                        icon="gg:link"
                        style={{
                          color: '#B2B3C5',
                          boxShadow: '0 0 0 4px #FFFFFF',
                          cursor: 'pointer',
                          background: '#FFFFFF',
                          borderRadius: '15px',
                        }}
                      />
                      <Iconify
                        icon="mdi:edit"
                        style={{
                          color: '#B2B3C5',
                          boxShadow: '0 0 0 4px #FFFFFF',
                          cursor: 'pointer',
                          background: '#FFFFFF',
                          borderRadius: '15px',
                        }}
                      />
                      <Iconify
                        onClick={handleActionsBanner('delete', index, self)}
                        icon="ic:round-delete"
                        style={{
                          color: '#B2B3C5',
                          boxShadow: '0 0 0 4px #FFFFFF',
                          cursor: 'pointer',
                          background: '#FFFFFF',
                          borderRadius: '15px',
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Box>
            ) : (
              bannerType === 'slider' && (
                <Box>
                  <Box sx={{ width: '100%', my: 2 }}>
                    <Typography variant="caption" color="#8688A3">
                      Slider Type
                    </Typography>
                    <RadioGroup
                      row
                      // value={logoObj?.position || 'center'}
                      // onChange={(event: any) =>
                      //   handleChangeEvent('position', event?.target?.value, 'logoObj')
                      // }
                    >
                      <FormControlLabel
                        value="auto"
                        control={<Radio size="medium" />}
                        label="Auto"
                      />
                      <FormControlLabel
                        value="manual"
                        control={<Radio size="medium" />}
                        label="Manual "
                      />
                      <FormControlLabel
                        value="fadeOut"
                        control={<Radio size="medium" />}
                        label="Fade Out"
                      />
                    </RadioGroup>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: '120px',
                      background: '#FFFFFF 0% 0% no-repeat padding-box',
                      border: '4px dashed #EBEBF0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      mt: '20px',
                    }}
                    component="label"
                  >
                    <VisuallyHiddenInput
                      disabled={themeConfig.bannerImages.length == 3}
                      type="file"
                      onChange={handleNewBanner('bannerImages')}
                    />
                    <Iconify icon="ic:round-add" style={{ color: '#B2B3C5' }} />
                    <Typography variant="caption" component="p" color="#8688A3">
                      Add New Banner (Max 3)
                    </Typography>
                  </Box>
                  {themeConfig.bannerImages.map((img, index, self) => (
                    <BannerSliderAccordion
                      customPresets={customPresets}
                      img={img}
                      index={index}
                      handleActionsBanner={handleActionsBanner}
                      self={self}
                    />
                  ))}
                </Box>
              )
            )}
          </AccordionDetails>
        </Accordion>
      )}
      {themeConfig.bannerShow && (
        <Accordion
          sx={{
            width: '100%',
          }}
        >
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Container</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack gap={2}>
              <Box sx={{ width: '100%', my: 2 }}>
                <Typography variant="caption" color="#8688A3">
                  Border Radius (%)
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      // value={logoObj?.borderRaduis || 0}
                      // onChange={(_event: Event, newValue: number | number[]) =>
                      //   handleChangeEvent('borderRaduis', newValue, 'logoObj')
                      // }
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                    />
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Border Bottom Width
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      // value={appBar?.container?.borderBottomWidth || 0}
                      // onChange={(_event: Event, newValue: number | number[]) => {
                      //   handleChangeEvent('borderBottomWidth', newValue, 'container');
                      // }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={20}
                    />
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Border Color
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                </Stack>
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="caption" sx={{ fontWeight: 900 }}>
                  Shadow
                </Typography>
                <Switch
                  // checked={appBar?.icon?.shadow}
                  // onChange={(event: any, value: any) => handleChangeEvent('shadow', value, 'icon')}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Shadow Color
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Sketch presetColors={customPresets} style={{ width: '100%' }} />
                </Stack>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Margin Top
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      // value={appBar?.container?.borderBottomWidth || 0}
                      // onChange={(_event: Event, newValue: number | number[]) => {
                      //   handleChangeEvent('borderBottomWidth', newValue, 'container');
                      // }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={20}
                    />
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Margin Bottom
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      // value={appBar?.container?.borderBottomWidth || 0}
                      // onChange={(_event: Event, newValue: number | number[]) => {
                      //   handleChangeEvent('borderBottomWidth', newValue, 'container');
                      // }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={20}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
      {themeConfig.bannerShow && (
        <Accordion>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Banner</Typography>
            </Box>
          </AccordionSummary>
        </Accordion>
      )}

      {/* <Divider sx={{ borderWidth: '1px', borderColor: '#EBEBEB', my: '20px' }} /> */}
    </Box>
  );
}
