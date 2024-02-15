
import React, { ChangeEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Box, Switch, TextField, Slider, RadioGroup, FormControlLabel, Radio, } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store/store';
import { saveLogo } from 'src/redux/store/thunks/builder';
import { MuiColorInput } from 'mui-color-input';

// ----------------------------------------------------------------------

interface LogoProps {
    themeConfig?: {
        logo: string;
        navLogoPosition?: string
        // Add other themeConfig properties as needed
    };
    builderId: string
    handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
}

export default function LogoDealer({ themeConfig, handleThemeConfig, builderId }: LogoProps) {

    const [logoObj, setLogoObj] = useState<any>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleChangeEvent = (key: any, value: any, parent: any) => {
        setLogoObj({ ...logoObj, [key]: value })
    }


    const handleImageChange64 = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result?.toString().split(',')[1]; // Get the base64 data
                console.log('Base64:', base64); // Log the base64 data
                // setImagePreview(reader.result?.toString() || null);
                handleThemeConfig(key, reader.result?.toString() || "");

                saveTempData(file);


            };

            reader.readAsDataURL(file); // Read the file as data URL
        } else {
            alert('Please select a valid image file.');
        }
    };
    const saveTempData = (file: any) => {
        const formDataToSend = new FormData();
        formDataToSend.append('image', file);

        dispatch(saveLogo({ builderId: builderId, data: formDataToSend })).then((response: any) => {
            console.log("response", response);
        });
    }

    const isColorValid = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$|^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$|^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$|^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$/.test(color);


    return (
        <Box mt='20px'>

            <Stack direction='row' justifyContent='space-between' alignItems='center' width={"100%"} >
                <Typography variant='caption' sx={{ fontWeight: 900 }}>Show Logo</Typography>
                <Switch
                    checked={logoObj?.status}
                    onChange={(event: any) => handleChangeEvent('status', event?.target?.value, 'logoObj')}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Stack>

            <Box sx={{ width: "100%", my: 2 }} >
                <Typography variant='caption' color='#8688A3'>Position</Typography>
                <RadioGroup row value={logoObj?.position || "center"} onChange={(event: any) => handleChangeEvent('position', event?.target?.value, 'logoObj')}>
                    <FormControlLabel value="left" control={<Radio size="medium" />} label="Left" />
                    <FormControlLabel value="center" control={<Radio size="medium" />} label="Center " />
                    <FormControlLabel value="right" control={<Radio size="medium" />} label="Right" />
                </RadioGroup>
            </Box>


            <Stack direction='row' my={2} alignItems='center' spacing='20px'>

                <Box sx={{
                    width: "80px",
                    height: "80px",
                    outline: "#EBEBF0 dashed 4px",
                    borderRadius: "20px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${themeConfig?.logo})`,
                    backgroundSize: '100% 100%',
                }} component="label" >

                    <VisuallyHiddenInput type='file' onChange={handleImageChange64('logo')} />
                    <Iconify icon='bi:image' style={{ color: '#C2C3D1', display: themeConfig?.logo ? 'none' : 'block' }} />
                </Box>

                <Box>
                    <Typography component='p' sx={{ fontSize: '13px !important' }} variant='caption' color='#8688A3'>
                        Maximum size is 5mb
                    </Typography>
                    <Typography variant='caption' sx={{ fontSize: '11px !important' }} color='#8688A3'>
                        You can use these extensions <br /> SVG, PNG or JPG
                    </Typography>
                </Box>
            </Stack>

            <Box sx={{ width: "100%", my: 2 }} >
                <Typography variant='caption' color='#8688A3'>Border Width (%)</Typography>
                <Stack direction='row' alignItems='center' spacing='18px'>
                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                        <Slider
                            value={logoObj?.borderWidth || 0}
                            onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderWidth', newValue, 'logoObj')}
                            valueLabelDisplay="auto"
                            marks
                            step={1}
                            min={0}
                            max={5}
                        />
                    </Stack>
                </Stack>
            </Box>
            <Box sx={{ width: "100%", my: 2 }} >
                <Typography variant='caption' color='#8688A3'>Border Radius (%)</Typography>
                <Stack direction='row' alignItems='center' spacing='18px'>
                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                        <Slider
                            value={logoObj?.borderRaduis || 0}
                            onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderRaduis', newValue, 'logoObj')}
                            valueLabelDisplay="auto"
                            marks
                            step={5}
                            min={0}
                            max={100}
                        />
                    </Stack>
                </Stack>
            </Box>

            <Box sx={{ width: "100%", display: 'flex', gap: 2, my: 2 }} >
                <Box>
                    <Typography variant='caption' color='#8688A3'>Width</Typography>
                    <Stack direction='row' alignItems='center' spacing='18px'>
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                            <TextField variant='filled'
                                type='number'
                                value={logoObj?.width}
                                onChange={event => handleChangeEvent('width', event.target.value, 'logoObj')}
                            />
                        </Stack>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant='caption' color='#8688A3'>Height</Typography>
                    <Stack direction='row' alignItems='center' spacing='18px'>
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                            <TextField variant='filled'
                                type='number'
                                value={logoObj?.height}
                                onChange={event => handleChangeEvent('height', event.target.value, 'logoObj')}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Box>





            <Box sx={{ width: "100%", my: 2 }} >
                <Typography variant='caption' color='#8688A3'>Logo Text</Typography>
                <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <TextField variant='filled'
                        type='text'
                        fullWidth
                        value={logoObj?.text}
                        onChange={(event: any) => handleChangeEvent('text', event.target.value, 'logoObj')}
                    />
                </Stack>
            </Box>

            <Box sx={{ width: "100%", my: 2 }} >
                <Typography variant='caption' color='#8688A3'>Text Background</Typography>
                <Stack direction='row' alignItems='center' spacing='18px'>
                    <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                        value={logoObj?.textBg ?? "#000001"}
                        format="hex"
                        onChange={event => isColorValid(event) ? handleChangeEvent('textBg', event, 'logoObj') : null}
                    />
                </Stack>
            </Box>
            <Box sx={{ width: "100%", my: 2 }} >
                <Typography variant='caption' color='#8688A3'>Text Color</Typography>
                <Stack direction='row' alignItems='center' spacing='18px'>
                    <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                        value={logoObj?.color ?? "#000001"}
                        format="hex"
                        onChange={event => isColorValid(event) ? handleChangeEvent('color', event, 'logoObj') : null}
                    />
                </Stack>
            </Box>





        </Box>
    )
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});