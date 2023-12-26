/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Box, Grid, Typography, Paper, Stack, Switch, MenuItem, FormControl, Divider, Chip, } from '@mui/material';
import CountrySelect from 'src/sections/customers/view/CountryField';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AppDispatch } from 'src/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { createPaymentMothod, fetchOnePaymentMethods, fetchPaymentMethodsList } from 'src/redux/store/thunks/paymentMethods';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
// import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
import Linker from '../../subscription-plan/link';
import PaymentsNavBar from '../PaymentsNavBar';




// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Payment Gateway', label: 'Payment Gateways' },
  { value: 'Installment Service', label: 'Installment Services' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cash On Delivery', label: 'Cash On Delivery' },
];

// ----------------------------------------------------------------------

export default function OrdersListView() {

  const dispatch = useDispatch<AppDispatch>();
  const paymentMethodState = useSelector((state: any) => state.paymentMethods);
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();
  const [openPayment, setOpenPayment] = useState<any>({
    open: false,
  });

  const [value, setValue] = useState('Payment Gateway');

  const [mySubCat, setMySubCat] = React.useState('5.000');

  const [data, setData] = useState<any>(null);
  const [editId, setEditId] = useState<any>(null);

  const [paymentMethodsList, setPaymentMethodsList] = useState<any>(paymentMethodState?.list)

  useEffect(() => {
    console.log("paymentMethodState?.list", paymentMethodState?.list);

    const filterList = paymentMethodState?.list.filter((list: any) => list?.type === value);
    setPaymentMethodsList(filterList)
  }, [paymentMethodState?.list, value]);


  useEffect(() => {
    if (paymentMethodState?.paymentMethod) {
      console.log(paymentMethodState?.paymentMethod);

      // dispatch(fetchOnePaymentMethods(editId));
    } else {
      setData(null);
    }
  }, [paymentMethodState])



  useEffect(() => {
    if (paymentMethodState.status === 'idle') {
      dispatch(fetchPaymentMethodsList(paymentMethodState.error));
    }
  }, [paymentMethodState, dispatch]);


  const handleChangeMySubCat = (event: SelectChangeEvent) => {
    setMySubCat(event.target.value as string);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // ----------------------------------------------

  // Sub Category
  const PaymentSchema = Yup.object().shape({
    type: Yup.string().required('Field is required'),
    name: Yup.string().required('Field is required'),
    url: Yup.string().required('Field is required'),
    price: Yup.string().required('Field is required'),
    // description: Yup.string().required('Field is required'),
    // bankAccountName: Yup.string().required('Field is required'),
    // bankIBAN: Yup.string().required('Field is required'),
    // cashOnDeliveryCost: Yup.string().required('Field is required'),
  });

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (reqData) => {

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]: any) => {
      if (key === 'availableAreas') {
        value.forEach((file: any, index: any) => {
          formData.append(`${key}[${index}]`, file);
        });
      } else if (key === 'image') {
        if (typeof value !== 'string') {
          formData.append(`${key}`, value);
        }
      } else if (key === 'supporters') {
        const newImages = value.filter((file: any) => typeof file !== 'string');
        newImages.forEach((file: any, index: any) => {
          formData.append(`${key}`, file);
        });
      } else {
        formData.append(key, value);
      }
    });

    if (!editId) {
      handleCreatePaymentMethod(formData);
    } else {
      handleEditPaymentMethod(formData);
    }
  });


  const handleCreatePaymentMethod = (data: any) => {
    dispatch(createPaymentMothod(data)).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        setData(null);
        setOpenPayment({ open: false })
        enqueueSnackbar('Successfully Created!', { variant: 'success' });
      } else {
        enqueueSnackbar(`Error! ${response?.error?.message}`, { variant: 'error' });
      }
    });
  }


  const handleEditPaymentMethod = (data: any) => {
    console.log("data", data);
  }



  // ----------------------------------------------


  const toggleDrawer = () => (event: React.SyntheticEvent | React.MouseEvent) => {
    // dispatch(fetchOneOrders(item?._id));
    setOpenPayment({ open: true });
  };

  const handleDrawerClose = (event: React.SyntheticEvent | React.KeyboardEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpenPayment({ open: false });
  };



  const handleChangeData = (event: SelectChangeEvent) => {
    setData({ ...data, [event.target.name]: event.target.value as string });
  };

  const handleAddImage = (files: any) => {
    if (files.length > 0) {
      setData((prevData: any) => ({
        ...prevData,
        image: files[0]
      }));
    }
  };

  const handleAddImages = (files: any) => {
    if (files.length > 0) {
      setData((prevData: any) => ({
        ...prevData,
        supporters: prevData?.supporters ? [...prevData.supporters, files[0]] : [files[0]],
      }));
    }
  };

  const handleRemoveImage = (type: any, index: any = null) => {
    setData((current: any) => {
      if (type === 'image') {
        const { image, ...rest } = current;
        return {
          ...rest,
        };
      }
      const { supporters, ...rest } = current;
      const updatedImages = supporters.filter((_: any, i: any) => i !== index);
      return {
        ...rest,
        supporters: updatedImages,
      };
    });
  };

  const handleAddCountries = (value: any) => {
    const list = data?.availableAreas || [];
    const isExist = list.find((li: any) => li === value?.code);
    if (!isExist) {
      list.push(value?.code);
      setData({ ...data, availableAreas: list })
    }
  }

  const handleRemoveCountries = (value: any) => {
    const list = data?.availableAreas || [];
    const filteredList = list.filter((li: any) => li !== value);
    setData({ ...data, availableAreas: filteredList })
  }

  const handleEdit = (id: any) => {
    console.log("id", id);
    setEditId(id);
    dispatch(fetchOnePaymentMethods(id));
  }

  const imagesItrations = Array.from({ length: 5 }, (_, index) => index);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container justifyContent='space-between' alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Grid item xs={12} md="auto">
          <CustomCrumbs heading="Payment Methods" crums={false} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Button sx={{
            float: "right",
            backgroundColor: 'rgb(27, 252, 182)',
            '&:hover': { backgroundColor: 'rgb(27, 252, 182)' },
            color: '#0F1349', fontSize: '13px', borderRadius: '16px',
            padding: "6px 17px", boxShadow: '0px 6px 20px #1BFCB633'
          }}
            onClick={toggleDrawer()}
            startIcon={<Iconify icon="mingcute:add-fill" />}
          >
            Add New Payment Method
          </Button>

        </Grid>

        <Grid item xs={12} md={5}>
          <TextField
            placeholder='Search...'
            fullWidth
            variant='filled'
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <Box component='img' src='/raw/search.svg' sx={{ width: '15px' }} />
              </InputAdornment>,
            }}
            sx={{
              '& .MuiInputAdornment-root': {
                marginTop: '0px !important',
                paddingLeft: '10px'
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons={false}
                  sx={{
                    px: 2.5,
                    boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                  }}
                >
                  {STATUS_OPTIONS.map((tab) => (
                    <Tab
                      key={tab.value}
                      iconPosition="end"
                      value={tab.value}
                      label={tab.label}
                    />
                  ))}
                </TabList>
              </Box>

              <TabPanel value={value} sx={{ px: 0, }}>
                <Typography mb='20px' component='p' variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.8rem' }} >
                  Activate any of the payment options linked to enable your customers to pay
                </Typography>

                <Grid container spacing={2}>
                  {paymentMethodsList.map((paymentM: any, indx: any) =>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ borderRadius: '16px' }}>
                        <Grid container item alignItems='center' columnGap="20px" rowGap="10px" sx={{ p: "30px 22px", minHeight: '150px', boxShadow: '0px 6px 20px #00000014', borderRadius: '16px' }}>
                          <Grid item xs={12} sx={{ minHeight: '57px' }}>
                            <Box component='img' width='50px' src={paymentM?.image} alt=" " />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography component='p' variant="subtitle2" sx={{ fontSize: '1.1rem', fontWeight: 900 }} > {paymentM.name} Gateway</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }} >
                              <Typography component='p' variant="subtitle2" sx={{ fontSize: '.8rem', fontWeight: 800 }} > Support: </Typography>
                              {paymentM.supporters.map((flag: any, indx: any) => <Box key={indx} component='img' src={flag} alt=" " width='23px' />)}
                            </Box>
                          </Grid>
                          <Grid item xs='auto'>
                            <Button
                              onClick={() => handleEdit(paymentM?._id)}
                              sx={{
                                backgroundColor: 'rgb(27, 252, 182)',
                                '&:hover': { backgroundColor: 'rgb(27, 252, 182)' },
                                color: '#0F1349', fontSize: '13px', borderRadius: '16px',
                                padding: "6px 17px", boxShadow: '0px 6px 20px #1BFCB633'
                              }}>
                              Edit Setup
                            </Button>
                          </Grid>
                          <Grid item xs="auto">
                            <Linker path={paymentM?.url || "#"} target='_blank'
                              style={{ textDecoration: 'underline', fontSize: '13px', color: "#8688A3" }}
                            >view Website</Linker>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                </Grid>
              </TabPanel>

              {/* <TabPanel value="Installment Services" sx={{ px: 0, }}>
                <Typography mb='20px' component='p' variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.8rem' }} >
                  Activate any of the payment options linked to enable your customers to pay
                </Typography>

                <Grid container spacing={2}>
                  {[
                    {
                      logo: '/raw/is1.png',
                      title: 'Tabby',
                      des: "Split purchases into 4 interest-free payments while you get paid in full-upfront.",
                    }, {
                      logo: '/raw/is2.png',
                      title: 'Tamara',
                      des: "Pay later in 3 installments or in one payment within 30 days from the date of shipment."
                    }
                  ].map((product, indx) =>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ borderRadius: '16px' }}>
                        <Grid container item alignItems='center' columnGap="20px" rowGap="10px" sx={{ p: "30px 22px", minHeight: '150px', boxShadow: '0px 6px 20px #00000014', borderRadius: '16px' }}>
                          <Grid item xs={12} sx={{ minHeight: '53px' }}>
                            <Box component='img' src={product.logo} alt=" " />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography component='p' variant="subtitle2" sx={{ fontSize: '1.1rem', fontWeight: 900 }} > {product.title} </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography component='p' variant="subtitle2" sx={{ fontSize: '.8rem', opacity: .8 }} > {product.des} </Typography>
                          </Grid>
                          <Grid item xs='auto'>
                            <Button sx={{
                              backgroundColor: 'rgb(27, 252, 182)',
                              '&:hover': { backgroundColor: 'rgb(27, 252, 182)' },
                              color: '#0F1349', fontSize: '13px', borderRadius: '16px',
                              padding: "6px 17px", boxShadow: '0px 6px 20px #1BFCB633'
                            }}>
                              Activate
                            </Button>
                          </Grid>
                          <Grid item xs="auto">
                            <Linker path="https://www.google.com/" target='_blank'
                              style={{ textDecoration: 'underline', fontSize: '13px', color: "#8688A3" }}
                            >view Website</Linker>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                </Grid>
              </TabPanel>

              <TabPanel value="Bank Transfer" sx={{ px: 0, }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography mb='20px' component='p' variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.8rem' }} >
                    Enable bank transfer method for your payments.
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  {[
                    {
                      logo: '/raw/bt1.png',
                      title: 'Bank Account',
                      IBAN: "KW313544465578985113113122",
                      status: 'Accepted'
                    }
                  ].map((product, indx) =>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper sx={{ borderRadius: '16px' }}>
                        <Grid container item alignItems='center' columnGap="20px" rowGap="10px" sx={{ p: "30px 22px", minHeight: '150px', boxShadow: '0px 6px 20px #00000014', borderRadius: '16px' }}>
                          <Grid item xs={12} sx={{ minHeight: '53px' }}>
                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                              <Box component='img' src={product.logo} alt=" " />
                              <Switch size='medium' color='primary' defaultChecked />
                            </Stack>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography component='p' variant="subtitle2" sx={{ fontSize: '1.1rem', fontWeight: 900 }} > {product.title} </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography component='p' variant="subtitle2" sx={{ fontSize: '.8rem', opacity: .6 }} >IBAN: {product.IBAN} </Typography>
                          </Grid>
                          <Grid item xs='auto'>
                            <Stack direction='row' alignItems='center' spacing='10px'>
                              <Box sx={{
                                height: '10px',
                                width: '10px',
                                borderRadius: '10px',
                                backgroundColor: 'rgb(26, 247, 178)'
                              }} />
                              <Typography component='p' variant="subtitle2" sx={{ fontSize: '.8rem', opacity: 1 }} > {product.status} </Typography>

                            </Stack>
                          </Grid>

                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                </Grid>
              </TabPanel>

              <TabPanel value="Cash On Delivery" sx={{ px: 0, }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ borderRadius: '16px' }}>
                      <Grid container item alignItems='center' columnGap="20px" rowGap="10px" sx={{ p: "30px 22px", minHeight: '150px', borderRadius: '16px' }}>
                        <Grid item xs={12} sx={{ minHeight: '53px' }}>
                          <Stack direction='row' alignItems='center' spacing='10px'>
                            <Switch color='primary' defaultChecked />
                            <Box>
                              <Typography component='p' variant="subtitle2" sx={{ fontSize: '.8rem', fontWeight: 900, opacity: .8 }} > Cash On Delivery Method </Typography>
                              <Typography component='p' variant="subtitle2" sx={{ fontSize: '.8rem', opacity: .6 }} > All customers to pay cash on delivery. </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography component='p' variant="subtitle2" sx={{ pl: '5px', fontSize: '.8rem', opacity: .7 }} > Cash On Delivery Cost </Typography>
                          <FormControl fullWidth>
                            <Select
                              variant='filled'
                              value={mySubCat}
                              sx={{
                                fontWeight: 900
                              }}
                              onChange={handleChangeMySubCat}
                              endAdornment={<div style={{ fontSize: '12px', marginRight: '20px', marginTop: '3px' }}>KWD</div>}
                            >
                              <MenuItem value='5.000'>5.000</MenuItem>
                              <MenuItem value='10.000'>10.000</MenuItem>
                              <MenuItem value='15.000'>15.000</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </TabPanel> */}

            </TabContext>
          </Box>
        </Grid>
      </Grid>


      <PaymentsNavBar
        open={openPayment.open}
        onClose={handleDrawerClose}
        title={editId ? "Edit Payment Method" : "Create Payment Method"}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              // onClick={editSubCatId ? handleEditSubCategory : handleCreateSubCategory}
              loading={isSubmitting}
              onClick={() => methods.handleSubmit(onSubmit as any)()}
              sx={{ borderRadius: '30px' }}
            >
              {editId ? 'Update' : 'Save'}
            </LoadingButton>
          </Stack>
        }
      >
        <Divider flexItem />

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack
            sx={{ width: '100%' }}
            direction="column"
            alignItems="flex-start"
            justifyContent="space-between"
            gap="10px"
          >
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Payment Type
              </Typography>
              <RHFSelect
                fullWidth
                variant="filled"
                name="type"
                value={data?.type || ''}
                settingStateValue={handleChangeData}
              >

                <MenuItem value="Payment Gateway">
                  Payment Gateways
                </MenuItem>
                <MenuItem value="Installment Service">
                  Installment Services
                </MenuItem>
                <MenuItem value="Bank Transfer">
                  Bank Transfer
                </MenuItem>
                <MenuItem value="Cash on Delivery">
                  Cash on Delivery
                </MenuItem>

              </RHFSelect>
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Name
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="name"
                value={data?.name || ""}
                settingStateValue={handleChangeData}
              />
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                URL
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="url"
                value={data?.url || ""}
                settingStateValue={handleChangeData}
              />
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Price
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="price"
                value={data?.price || ""}
                settingStateValue={handleChangeData}
              />
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Image
              </Typography>

              {data?.image ? (
                <Box
                  sx={{
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    flexDirection: 'column',
                    border: '1px dashed rgb(134, 136, 163,.5)',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={typeof data?.image === 'string' ? data?.image : URL.createObjectURL(data?.image)}
                    alt=""
                    sx={{ maxHeight: '95px' }}
                  />
                  <Box
                    onClick={() => handleRemoveImage('image')}
                    sx={{
                      backgroundColor: 'rgb(134, 136, 163,.09)',
                      padding: '10px 11px 7px 11px',
                      borderRadius: '36px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}
                  >
                    <Iconify icon="ic:round-delete" style={{ color: '#8688A3' }} />
                  </Box>
                </Box>
              ) : (
                <UploadBox
                  sx={{
                    width: '100%!important',
                    height: '100px!important',
                    textAlign: 'center',
                    padding: '20px',
                  }}
                  onDrop={handleAddImage}
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
                        flexDirection: 'column',
                      }}
                    >
                      <Iconify icon="system-uicons:picture" style={{ color: '#8688A3' }} />
                      <span style={{ color: '#8688A3', fontSize: '.6rem' }}>
                        Upload Image
                      </span>
                    </Box>
                  }
                />
              )}

            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Supporters
              </Typography>

              <Box mt="10px" sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {imagesItrations.map((itration: any, ind: any) => (
                  <Box key={ind}>
                    {data?.supporters?.length > 0 && data?.supporters[itration] ? (
                      <Box
                        sx={{
                          width: '50px',
                          height: '50px',
                          my: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          flexDirection: 'column',
                          border: '1px dashed rgb(134, 136, 163,.5)',
                          borderRadius: '10px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={typeof data?.supporters[itration] === 'string' ? data?.supporters[itration] : URL.createObjectURL(data?.supporters[itration])}
                          alt=""
                          sx={{ maxHeight: '95px' }}
                        />
                        <Box
                          onClick={() => handleRemoveImage('supporters', itration)}
                          sx={{
                            backgroundColor: 'rgb(134, 136, 163,.09)',
                            padding: '5px',
                            borderRadius: '36px',
                            cursor: 'pointer',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                          }}
                        >
                          <Iconify icon="ic:round-delete" style={{ color: '#8688A3', width: '15px' }} />
                        </Box>
                      </Box>
                    ) : (
                      <UploadBox
                        sx={{
                          width: '50px!important',
                          height: '50px!important',
                          textAlign: 'center',
                          padding: '5px',
                        }}
                        onDrop={handleAddImages}
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
                              flexDirection: 'column',
                            }}
                          >
                            <Iconify icon="system-uicons:picture" style={{ color: '#8688A3' }} />
                          </Box>
                        }
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Description
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="description"
                value={data?.description || ""}
                settingStateValue={handleChangeData}
              />
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Bank Account Name
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="bankAccountName"
                value={data?.bankAccountName || ""}
                settingStateValue={handleChangeData}
              />
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Bank IBAN
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="bankIBAN"
                value={data?.bankIBAN || ""}
                settingStateValue={handleChangeData}
              />
            </Box>

            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Cash On Delivery Cost
              </Typography>
              <RHFTextField
                fullWidth
                variant="filled"
                name="cashOnDeliveryCost"
                value={data?.cashOnDeliveryCost || ""}
                settingStateValue={handleChangeData}
              />
            </Box>

            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                variant="subtitle2"
                sx={{ fontWeight: 900, fontSize: '.9rem' }}
              >
                Cash on Delivery
              </Typography>
              <Switch
                size="medium"
                checked={data?.cashOnDelivery || false}
                onChange={(e: any) =>
                  setData({ ...data, cashOnDelivery: e.target.checked })
                }
              />
            </Box>
            <Box sx={{ width: '100%' }} >
              <Typography
                component="p"
                noWrap
                variant="subtitle2"
                sx={{ opacity: 0.7, fontSize: '.9rem', my: 1, maxWidth: { xs: '120px', md: '218px' } }}
              >
                Available Countries
              </Typography>

              <CountrySelect
                name="availableAreas"
                variant="filled"
                value=''
                onChange={(event: any, value: any) => {
                  if (value) {
                    handleAddCountries(value)
                  }
                }}
              />
              <Box display='flex' sx={{ flexWrap: "wrap" }} gap={2} >
                {data?.availableAreas?.map((country: any, ind: any) => (
                  <Chip variant="outlined" key={ind} label={country} color="info" onDelete={() => handleRemoveCountries(country)} />
                ))}
              </Box>

            </Box>


          </Stack>



        </FormProvider>


      </PaymentsNavBar>


    </Container >
  );
}
