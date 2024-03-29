'use client';
import Button from '@mui/material/Button';
import { Box, Grid, MenuItem, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { RoleBasedGuard } from 'src/auth/guard';
import { BottomActions } from 'src/components/bottom-actions';
import Container from '@mui/material/Container';
import DetailsNavBar from 'src/sections/products/DetailsNavBar';
import { LoadingButton } from '@mui/lab';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  useAddNewThemeMutation,
  useDeleteThemeMutation,
  useGetAllThemesQuery,
  useGetThemeByIdQuery,
  useUpdateThemeMutation,
} from 'src/redux/store/services/api';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
import { isValidJSON } from 'src/utils/functions';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
import { types } from 'src/sections/themes/catigories/theme-types';
import ThemeCard from 'src/sections/themes/view/themeCard';
import { useDispatch } from 'react-redux';
import {
  createTheme,
  deleteThemeById,
  editTheme,
  fetchThemeById,
  fetchThemeList,
} from 'src/redux/store/thunks/theme';
import { AppDispatch } from 'src/redux/store/store';
import { enqueueSnackbar } from 'notistack';

const page = () => {
  const [selectedType, setSelectedType] = useState<any>('');
  const [allThemesData, setAllThemesData] = useState<any>();
  const [addTheme] = useAddNewThemeMutation();
  const { data: allThemes } = useGetAllThemesQuery(selectedType);
  const [openDetails, setOpenDetails] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [themeData, setThemeData] = useState<any>(null);
  const [themeDrawer, setThemeDrawer] = useState(false);
  const [editId, setEditId] = useState('');
  const ProductSchema = Yup.object().shape({
    title: Yup.string().required(),
    type: Yup.string().required(),
    json: Yup.string()
      .test('is-json', 'json must be a valid JSON string', (value) => isValidJSON(value))
      .required(),
  });
  const methods = useForm({
    resolver: yupResolver(ProductSchema),
  });

  const handleTheme = (e: any) => {
    const { name, value } = e.target;
    setThemeData({
      ...themeData,
      [name]: value,
    });
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setThemeData(null);
  };

  const toggleDrawerCommon = (id: any) => {
    setThemeDrawer(true);
    if (id) {
      setEditId(id);
    }
  };
  const { data } = useGetThemeByIdQuery(editId);
  useEffect(() => {
    if (data) {
      setThemeData(data?.data);
    }
  }, [editId, data]);
  const handleDrawerClose = () => {
    setThemeDrawer(false);
    setThemeData(null);
  };
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const [updateTheme, { isSuccess }] = useUpdateThemeMutation();
  // const onSubmit = handleSubmit(async (data) => {
  //   if (editId) {
  //     try {
  //       let theme = new FormData();
  //       theme.append('title', data.title);
  //       theme.append('type', data.type);
  //       theme.append('json', data.json);
  //       await updateTheme({ id: editId, theme }).unwrap();
  //     } catch (error) {
  //       reset();
  //     }
  //   } else {
  //     try {
  //       const newData = new FormData();
  //       newData.append('title', data.title);
  //       newData.append('type', data.type);
  //       newData.append('json', data.json);
  //       newData.append('image', themeData?.image);
  //       await addTheme(newData).unwrap();
  //     } catch (error) {
  //       reset();
  //     }
  //   }
  //   setThemeDrawer(false);
  //   setThemeData(null);
  // });
  const handleAddImage = (files: any) => {
    setThemeData({
      ...themeData,
      image: files[0],
    });
  };
  const handleRemoveImage = () => {
    setThemeData({
      ...themeData,
      image: null,
    });
  };
  useEffect(() => {
    dispatch(fetchThemeList()).then((res: any) => setAllThemesData(res?.payload?.data));
  }, []);
  // Image string to File
  async function convertImageUrlToFile(imageUrl: any) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
      const blob = await response.blob();
      return new File([blob], 'image.jpg', { type: blob.type });
    } catch (error) {
      console.error('Error fetching image:', error.message);
      throw error; // Re-throw the error to be handled where the function is called
    }
  }
  // Create Theme
  const handleCreateTheme = () => {
    try {
      const formData = new FormData();
      // Appending fields in formData
      formData.append('type', themeData.type);
      formData.append('title', themeData.title);
      formData.append('json', themeData.json);
      if (typeof themeData.image !== 'string') {
        formData.append('image', themeData.image);
      }
      // Pushing form data to createIcon
      dispatch(createTheme(formData)).then((response: any) => {
        if (response.meta.requestStatus === 'fulfilled') {
          // once pushing is done fetching the icons
          dispatch(fetchThemeList()).then((res) => setAllThemesData(res?.payload?.data));
          enqueueSnackbar('Successfully Created!', { variant: 'success' });
          handleDrawerClose();
        } else {
          enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
        }
      });
    } catch (error) {
      reset();
    }
  };
  // Edit Theme
  const handleThemeEdit = () => {
    const dataToPush = new FormData();
    // Appending fields in formData
    dataToPush.append('type', themeData.type);
    dataToPush.append('title', themeData.title);
    dataToPush.append('json', themeData.json);
    if (typeof themeData?.image === 'string') {
      // Convert image URL to File object
      const imageUrl = themeData?.image;
      const file = convertImageUrlToFile(imageUrl).then((resp: any) =>
        dataToPush.append('image', resp)
      );

      // Append the File object to FormData
    } else {
      dataToPush.append('image', themeData?.image);
    }
    if (editId) {
      dispatch(editTheme({ id: editId, data: dataToPush })).then((response: any) => {
        if (response.meta.requestStatus === 'fulfilled') {
          enqueueSnackbar('Successfully Updated!', { variant: 'success' });
          setThemeData({});
          setEditId('');
          dispatch(fetchThemeList()).then((resp) => setAllThemesData(resp?.payload?.data));
          handleDrawerClose();
        } else {
          enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
        }
      });
    }
  };
  // Delete Theme
  const handleThemeDelete = (id: any) => {
    dispatch(deleteThemeById(id)).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        dispatch(fetchThemeList()).then((response: any) =>
          setAllThemesData(response?.payload?.data)
        );
        enqueueSnackbar('Successfully Deleted!', { variant: 'success' });
      } else {
        enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
      }
    });
  };
  const onSubmit = handleSubmit(async (data) => {
    if (editId) {
      try {
        handleThemeEdit();
      } catch (error) {
        reset();
      }
    } else {
      try {
        handleCreateTheme();
      } catch (error) {
        reset();
      }
    }
  });
  useEffect(() => {
    dispatch(fetchThemeById(editId)).then((resp) => setThemeData(resp?.payload));
  }, [editId]);

  return (
    <Container>
      <RoleBasedGuard permission="CREATE_PRODUCT">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Adjust as needed for layout
            mt: 2, // Margin top for spacing
            gap: 5,
            alignItems: 'center',
          }}
        >
          <Grid xs={12} md="auto">
            <CustomCrumbs heading="Themes" crums={false} />
          </Grid>
          <BottomActions>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
              spacing="20px"
              sx={{ width: '100%', maxWidth: { xs: '100%', md: '250px' } }}
            >
              <Button
                startIcon="+"
                fullWidth
                sx={{ borderRadius: '30px', color: '#0F1349' }}
                component="button"
                variant="contained"
                color="primary"
                onClick={() => setThemeDrawer(true)}
              >
                Add New Theme
              </Button>
            </Stack>
          </BottomActions>
        </Box>
      </RoleBasedGuard>
      <Grid container spacing={2} sx={{ padding: '16px' }} gap={2}>
        <LoadingButton
          variant="soft"
          onClick={() => setSelectedType('')}
          color={null === selectedType ? 'success' : 'inherit'}
        >
          All
        </LoadingButton>
        {types.map((type: string, index: any) => (
          <LoadingButton
            key={index}
            variant="soft"
            onClick={() => setSelectedType(type)}
            color={type === selectedType ? 'success' : 'inherit'}
          >
            {type.toUpperCase()}
          </LoadingButton>
        ))}
      </Grid>
      <DetailsNavBar
        open={themeDrawer}
        onClose={handleDrawerClose}
        title={'Add New theme'}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              // onClick={editProductId ? editProductFun : createProductFun}
              loading={isSubmitting}
              onClick={() => {
                methods.handleSubmit(onSubmit as any)();
              }}
              sx={{ borderRadius: '30px' }}
            >
              {editId ? 'Update' : 'Add'}
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box width="100%">
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              image
            </Typography>

            <Box mt="10px" sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <Box>
                {themeData?.image ? (
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
                      src={
                        typeof themeData?.image === 'string'
                          ? themeData?.image
                          : URL.createObjectURL(themeData?.image)
                      }
                      alt=""
                      sx={{ maxHeight: '95px' }}
                    />
                    <Box
                      onClick={() => handleRemoveImage()}
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
                      width: '100px!important',
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
                        <span style={{ color: '#8688A3', fontSize: '.6rem' }}>Upload Image</span>
                      </Box>
                    }
                  />
                )}
              </Box>
            </Box>
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              title
            </Typography>

            <RHFTextField
              fullWidth
              variant="filled"
              settingStateValue={handleTheme}
              name="title"
              value={themeData?.title || ''}
            />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Category
            </Typography>

            <RHFSelect
              fullWidth
              variant="filled"
              name="type"
              id="demo-simple-select2"
              value={themeData?.type || ''}
              settingStateValue={handleTheme}
            >
              {types.map((type: string, index: any) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </RHFSelect>
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Json
            </Typography>

            <RHFTextField
              variant="filled"
              multiline
              fullWidth
              rows={5}
              sx={{ fontWeight: 900, fontSize: '26px' }}
              settingStateValue={handleTheme}
              name="json"
              value={themeData?.json || ''}
            />
          </Box>
        </FormProvider>
      </DetailsNavBar>
      <Grid container spacing={2} sx={{ padding: '16px' }}>
        {allThemesData
          ?.filter((item: any) => item?.type?.includes(selectedType))
          ?.map((el: any) => (
            <ThemeCard
              toggleDrawerCommon={toggleDrawerCommon}
              handleThemeDelete={handleThemeDelete}
              title={el?.title}
              type={el.type}
              image={el.image}
              id={el._id}
            />
          ))}
      </Grid>
    </Container>
  );
};

export default page;
