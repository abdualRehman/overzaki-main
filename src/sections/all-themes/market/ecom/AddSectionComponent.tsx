import { Box, Card, Divider, FormControlLabel, Radio, RadioGroup, Slider, Stack, TextField, Typography } from '@mui/material'
import { MuiColorInput } from 'mui-color-input'
import React, { useEffect, useState } from 'react'
import Iconify from 'src/components/iconify'

const AddSectionComponent = ({ onClose }: any) => {

    const [appBar, setAppBar] = useState<any>({});

    const isColorValid = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$|^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$|^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$|^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$/.test(color);


    useEffect(() => {

        console.log(appBar);

    }, [appBar])


    const handleChangeEvent = (target: string, event: any, parent: string) => {
        const nestedAppbar: any = appBar?.[parent] ?? {};
        setAppBar({ ...appBar, [parent]: { ...nestedAppbar, [target]: event } })
    }



    return (
        <div>
            <Card sx={{ borderRadius: '0px', p: '20px', height: '100%', boxShadow: '0px -6px 40px #00000014' }}>

                <Stack direction='row' justifyContent='space-between'>
                    <Box>
                        <Typography variant='h6'>Add New Section</Typography>
                        <Typography variant='caption' color='#8688A3'>
                            Select where you want to add this section.
                        </Typography>
                    </Box>
                    <Iconify width={25} icon='iconamoon:close-bold' style={{ cursor: 'pointer' }}
                        onClick={onClose}
                    />
                </Stack>
                <Divider sx={{
                    borderWidth: '2px', borderColor: '#F5F5F8', my: '10px',
                    '& .MuiDivider-wrapper': {
                        padding: 0
                    }
                }}>
                    <Stack direction='row' alignItems='center' spacing='8px' justifyContent='center' sx={{
                        width: "120px",
                        height: "36px",
                        background: "#F5F5F8",
                        borderRadius: "20px",
                    }} >
                        <Typography variant='button' color='#8688A3'>App Bar</Typography>
                    </Stack>
                </Divider>

                <Box mt='20px'>
                    <Typography variant='caption' color='#8688A3'>
                        Container
                    </Typography>
                    <Stack direction='column' gap={2} alignItems='center' justifyContent='space-between' sx={{
                        width: '100%',
                        minHeight: '61px',
                        border: '4px solid #8688A333',
                        borderRadius: '8px',
                        px: 2,
                        py: 3,
                    }}>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Status</Typography>
                            <RadioGroup row value={appBar?.container?.show || "true"} onChange={(event: any) => handleChangeEvent('show', event?.target?.value, 'container')}>
                                <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                <FormControlLabel value="false" control={<Radio size="medium" />} label="Hide" />
                            </RadioGroup>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Shadow</Typography>
                            <RadioGroup row value={appBar?.container?.shadow || "true"} onChange={(event: any) => handleChangeEvent('shadow', event?.target?.value, 'container')}>
                                <FormControlLabel value={"true"} control={<Radio size="medium" />} label="Show" />
                                <FormControlLabel value={"false"} control={<Radio size="medium" />} label="Hide" />
                            </RadioGroup>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Background Color</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.container?.backgroundColor}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColor', event, 'container') : null}
                                />
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Background Color(Dark)</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.container?.backgroundColorDark}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColorDark', event, 'container') : null}
                                />
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Border Bottom Width</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                    <Slider
                                        value={appBar?.container?.borderBottomWidth || 0}
                                        onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderBottomWidth', newValue, 'container')}
                                        valueLabelDisplay="auto"
                                        marks
                                        step={5}
                                        min={0}
                                        max={20}
                                    />
                                </Stack>
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Border Bottom Color</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.container?.borderBottomColor}
                                    // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, borderBottomColor: event }) : null}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('borderBottomColor', event, 'container') : null}
                                />
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Margin Bottom</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                    <Slider
                                        value={appBar?.container?.marginBottom || 0}
                                        onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('marginBottom', newValue, 'container')}
                                        valueLabelDisplay="auto"
                                        marks
                                        min={0}
                                        max={20}
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                    </Stack>
                </Box>
                <Box mt='20px'>
                    <Typography variant='caption' color='#8688A3'>
                        Icons
                    </Typography>
                    <Stack direction='column' gap={2} alignItems='center' justifyContent='space-between' sx={{
                        width: '100%',
                        minHeight: '61px',
                        border: '4px solid #8688A333',
                        borderRadius: '8px',
                        px: 2,
                        py: 3,
                    }}>

                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Has Background</Typography>
                            <RadioGroup row value={appBar?.icon?.hasBackground || "true"} onChange={(event: any) => handleChangeEvent('hasBackground', event?.target?.value, 'icon')}>
                                <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                <FormControlLabel value="false" control={<Radio size="medium" />} label="Hide" />
                            </RadioGroup>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Background Color</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.icon?.backgroundColor}
                                    // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, backgroundColor: event }) : null}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColor', event, 'icon') : null}
                                />
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Color</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.icon?.tintColor}
                                    // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, tintColor: event }) : null}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('tintColor', event, 'icon') : null}
                                />
                            </Stack>
                        </Box>

                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Shadow</Typography>
                            <RadioGroup row value={appBar?.icon?.shadow || "true"} onChange={(event: any) => handleChangeEvent('shadow', event?.target?.value, 'icon')}>
                                <FormControlLabel value={"true"} control={<Radio size="medium" />} label="Show" />
                                <FormControlLabel value={"false"} control={<Radio size="medium" />} label="Hide" />
                            </RadioGroup>
                        </Box>

                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Border Radius (%)</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                    <Slider
                                        value={appBar?.icon?.borderRaduis || 0}
                                        onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderRaduis', newValue, 'icon')}
                                        valueLabelDisplay="auto"
                                        marks
                                        step={5}
                                        min={0}
                                        max={100}
                                    />
                                </Stack>
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Border Color</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.icon?.borderColor}
                                    // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, borderColor: event }) : null}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('borderColor', event, 'icon') : null}
                                />
                            </Stack>
                        </Box>
                        <Box sx={{ width: "100%", display: 'flex', gap: 2 }} >
                            <Box>
                                <Typography variant='caption' color='#8688A3'>Width</Typography>
                                <Stack direction='row' alignItems='center' spacing='18px'>
                                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                        <TextField variant='filled'
                                            type='number'
                                            value={appBar?.icon?.width}
                                            // onChange={event => setAppBar({ ...appBar, width: event.target.value })}
                                            onChange={event => handleChangeEvent('width', event.target.value, 'icon')}
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
                                            value={appBar?.icon?.height}
                                            // onChange={event => setAppBar({ ...appBar, height: event.target.value })}
                                            onChange={event => handleChangeEvent('height', event.target.value, 'icon')}
                                        />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>

                    </Stack>
                </Box>
                <Box mt='20px'>
                    <Typography variant='caption' color='#8688A3'>
                        Text
                    </Typography>
                    <Stack direction='column' gap={2} alignItems='start' justifyContent='space-between' sx={{
                        width: '100%',
                        minHeight: '61px',
                        border: '4px solid #8688A333',
                        borderRadius: '8px',
                        px: 2,
                        py: 3,
                    }}>

                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Size</Typography>
                            <Stack direction='row' alignItems='start' spacing='18px'>
                                <Stack direction="row" alignItems="start" spacing={1} width={1}>
                                    <TextField variant='filled'
                                        type='number'
                                        value={appBar?.text?.size}
                                        // onChange={event => setAppBar({ ...appBar, width: event.target.value })}
                                        onChange={event => handleChangeEvent('size', event.target.value, 'text')}
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Is Bold</Typography>
                            <RadioGroup row value={appBar?.text?.isBold || "true"} onChange={(event: any) => handleChangeEvent('isBold', event?.target?.value, 'text')}>
                                <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                <FormControlLabel value="false" control={<Radio size="medium" />} label="Hide" />
                            </RadioGroup>
                        </Box>
                        <Box sx={{ width: "100%" }} >
                            <Typography variant='caption' color='#8688A3'>Color</Typography>
                            <Stack direction='row' alignItems='center' spacing='18px'>
                                <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                    value={appBar?.text?.color}
                                    // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, color: event }) : null}
                                    onChange={event => isColorValid(event) ? handleChangeEvent('color', event, 'text') : null}
                                />
                            </Stack>
                        </Box>

                    </Stack>
                </Box>


                <Divider sx={{
                    borderWidth: '2px', borderColor: '#F5F5F8', my: '20px',
                    '& .MuiDivider-wrapper': {
                        padding: 0
                    }
                }}>
                    <Stack direction='row' alignItems='center' spacing='8px' justifyContent='center' sx={{
                        width: "120px",
                        height: "36px",
                        background: "#F5F5F8",
                        borderRadius: "20px",
                        cursor: 'pointer'
                    }} >
                        <Iconify icon='mingcute:add-fill' style={{ color: '#8688A3' }} />
                        <Typography variant='button' color='#8688A3'>Add Here</Typography>
                    </Stack>
                </Divider>

                <Box mt='20px'>
                    <Typography variant='caption' color='#8688A3'>
                        Categories section (2)
                    </Typography>

                    <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{
                        width: '100%',
                        height: '178px',
                        border: '4px solid #8688A333',
                        borderRadius: '8px',
                    }}>
                        <Box component='img' src='/raws/catAS.png' sx={{ borderRadius: '8px', width: '100%', height: '100%' }} />
                    </Stack>
                </Box>
                <Divider sx={{
                    borderWidth: '2px', borderColor: '#F5F5F8', my: '20px',
                    '& .MuiDivider-wrapper': {
                        padding: 0
                    }
                }}>
                    <Stack direction='row' alignItems='center' spacing='8px' justifyContent='center' sx={{
                        width: "120px",
                        height: "36px",
                        background: "#F5F5F8",
                        borderRadius: "20px",
                        cursor: 'pointer'
                    }} >
                        <Iconify icon='mingcute:add-fill' style={{ color: '#8688A3' }} />
                        <Typography variant='button' color='#8688A3'>Add Here</Typography>
                    </Stack>
                </Divider>

                <Box mt='20px'>
                    <Typography variant='caption' color='#8688A3'>
                        Mobiles Section (3)
                    </Typography>

                    <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{
                        width: '100%',
                        height: '178px',
                        border: '4px solid #8688A333',
                        borderRadius: '8px',
                    }}>
                        <Box component='img' src='/raws/catAS.png' sx={{ borderRadius: '8px', width: '100%', height: '100%' }} />
                    </Stack>
                </Box>


            </Card>
        </div>
    )
}

export default AddSectionComponent