'use client';
import Button from '@mui/material/Button';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Box, ClickAwayListener, Grid, MenuItem, Typography } from '@mui/material';
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
  useAddNewIconMutation,
  useGetAllIconsQuery,
  useGetIconByIdQuery,
  useUpdateIconMutation,
} from 'src/redux/store/services/api';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
import IconCard from 'src/sections/icons/view/IconCard';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
import { types } from 'src/sections/icons/catigories/Icon-types';
import {
  createIcon,
  createIconCategory,
  deleteIconCategory,
  editIcon,
  fetchIconCategoryList,
  fetchIconsList,
  getIconCategoryById,
} from 'src/redux/store/thunks/icon';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { AppDispatch } from 'src/redux/store/store';

const page = () => {
  const [optionModal, setOptionModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedType, setSelectedType] = useState<any>('');
  const [addIcon] = useAddNewIconMutation();
  const { data: allIcons } = useGetAllIconsQuery(selectedType);
  const [openDetails, setOpenDetails] = useState(false);
  const [iconCategoryDrawer, setIconCategoryDrawer] = useState<boolean>(false);
  const [iconData, seticonData] = useState<any>(null);
  const [iconCategories, setIconCategories] = useState([]);
  const [iconCategoryData, setIconCategoryData] = useState({ name: '' });
  const [iconsData, setIconsData] = useState([{}]);
  const ProductSchema = Yup.object().shape({
    title: Yup.string().required(),
    type: Yup.string().required(),
    // url: Yup.string().required(),
  });
  const CategorySchema = Yup.object().shape({
    name: Yup.string().required(),

    // url: Yup.string().required(),
  });
  const methods = useForm({
    resolver: yupResolver(ProductSchema),
  });
  const categoryMethods = useForm({
    resolver: yupResolver(CategorySchema),
  });

  const handleTheme = (e: any) => {
    const { name, value } = e.target;
    seticonData((prev: any) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCategoryData = (e: any) => {
    const { name, value } = e.target;
    setIconCategoryData((prev: any) => {
      return { ...prev, [name]: value };
    });
  };
  const handleCloseDetails = () => {
    setOpenDetails(false);
    seticonData(null);
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [updateIcon, { isSuccess }] = useUpdateIconMutation();
  const onSubmit = handleSubmit(async (data: any) => {
    console.log(data);
    if (editId) {
      try {
        await updateIcon({ id: editId, ...data }).unwrap();
      } catch (error) {
        reset();
      }
    } else {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data?.category);
        // formData.append('url', data.url);
        formData.append('image', iconData.image);

        await addIcon({ id: editId, formData }).unwrap();
      } catch (error) {
        reset();
      }
    }
    setIconDrawer(false);
    seticonData(null);
    setIconCategoryData({ name: '' });
  });
  const handleAddImage = (files: any) => {
    seticonData({
      ...iconData,
      image: files[0],
    });
  };
  const handleRemoveImage = () => {
    seticonData({
      ...iconData,
      image: null,
    });
  };

  const [iconDrawer, setIconDrawer] = useState(false);
  const [editId, setEditId] = useState(null);
  // const data = useGetIconByIdQuery(editId);
  // console.log(data?.data?.data);

  const toggleDrawerCommon = (id: any) => {
    setIconDrawer(true);
    if (id) {
      setEditId(id);
    }
  };
  const { data } = useGetIconByIdQuery(editId);
  useEffect(() => {
    if (data) {
      seticonData(data?.data);
    }
  }, [editId, data]);

  const handleDrawerClose = () => {
    setIconDrawer(false);
    seticonData(null);
  };
  const handleCategoryDrawerClose = () => {
    setIconCategoryDrawer(false);
  };
  const handleCreateCategory = (data: any) => {
    dispatch(createIconCategory(data)).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        setIconCategoryData({ name: '' });
        enqueueSnackbar('Successfully Created!', { variant: 'success' });
        dispatch(fetchIconCategoryList()).then((res) => setIconCategories(res?.payload?.data));
        handleCategoryDrawerClose();
      } else {
        enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
      }
    });
  };
  useEffect(() => {
    dispatch(fetchIconsList()).then((res) => setIconsData(res?.payload?.data));
    dispatch(fetchIconCategoryList()).then((resp) => setIconCategories(resp?.payload?.data));
  }, []);
  // console.log(iconsData);
  const handleCategoryDelete = (id: any) => {
    dispatch(deleteIconCategory(id)).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        dispatch(fetchIconCategoryList()).then((response: any) =>
          setIconCategories(response?.payload?.data)
        );
        enqueueSnackbar('Successfully Deleted!', { variant: 'success' });
      } else {
        enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
      }
    });
  };
  const handleEdit = (id: any) => {
    setOptionModal(false);
    setIconCategoryDrawer(true);
    setEditCategoryId(id);
    dispatch(getIconCategoryById(id)).then((res) =>
      setIconCategoryData({ name: res?.payload.name })
    );
  };
  const handleEditPost = () => {
    if (editCategoryId) {
      dispatch(editIcon({ id: editCategoryId, data: iconCategoryData })).then((response: any) => {
        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(fetchIconCategoryList()).then((response: any) =>
            setIconCategories(response?.payload?.data)
          );
          setIconCategoryDrawer(false);
          enqueueSnackbar('Successfully Updated!', { variant: 'success' });
        } else {
          enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
        }
      });
    }
  };
  const handleCreateIcon = () => {
    try {
      const formData = new FormData();
      // Appending fields in formData
      formData.append('category', iconData.category);
      formData.append('title', iconData.title);
      if (typeof iconData.image !== 'string') {
        formData.append('image', iconData.image);
      }
      // Pushing form data to createIcon
      dispatch(createIcon(formData)).then((response: any) => {
        if (response.meta.requestStatus === 'fulfilled') {
          // once pushing is done fetching the icons
          dispatch(fetchIconsList()).then((res) => setIconsData(res?.payload?.data));
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
  const handleIconEdit = () => {
    const dataToPush = {
      category: iconData?.category,
      image: iconData?.image,
      title: iconData?.title,
    };
    if (editId) {
      dispatch(editIcon({ id: editId, data: dataToPush })).then((response: any) => {
        if (response.meta.requestStatus === 'fulfilled') {
          enqueueSnackbar('Successfully Updated!', { variant: 'success' });
          dispatch(fetchIconsList()).then((resp) => setIconsData(resp?.payload?.data));
          handleDrawerClose();
        } else {
          enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
        }
      });
    }
  };
  return (
    <Container>
      <RoleBasedGuard permission="CREATE_PRODUCT">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2, // Margin top for spacing
            gap: 5,
            alignItems: 'end',
          }}
        >
          <Grid xs={12} md="auto">
            <CustomCrumbs heading="Icons" crums={false} />
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                  onClick={() => setIconDrawer(true)}
                >
                  Add New Icon
                </Button>
              </Stack>
            </BottomActions>
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
                  onClick={() => setIconCategoryDrawer(true)}
                >
                  Add New Category
                </Button>
              </Stack>
            </BottomActions>
          </Grid>
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
        {iconCategories?.map((type: any, index: any) => (
          <LoadingButton
            key={index}
            variant="soft"
            onClick={() => setSelectedType(type?.id)}
            color={type === selectedType ? 'success' : 'inherit'}
          >
            {type?.name?.toUpperCase()}
            <MoreVertOutlinedIcon onClick={() => setOptionModal(type?.id)} />
            {optionModal === type?.id && (
              <ClickAwayListener onClickAway={() => setOptionModal(false)}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 30,
                    backgroundColor: 'red',
                    borderRadius: '12px',
                    padding: '8px',
                    zIndex: 999,
                  }}
                >
                  <Typography
                    onClick={() => handleCategoryDelete(type?.id)}
                    component="p"
                    noWrap
                    variant="subtitle2"
                    sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                  >
                    Delete
                  </Typography>
                  <Typography
                    component="p"
                    noWrap
                    onClick={() => handleEdit(type?.id)}
                    variant="subtitle2"
                    sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                  >
                    Edit
                  </Typography>
                </Box>
              </ClickAwayListener>
            )}
          </LoadingButton>
        ))}
      </Grid>
      <DetailsNavBar
        open={iconDrawer}
        onClose={handleDrawerClose}
        title={'Add New theme'}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={isSubmitting}
              onClick={editId ? () => handleIconEdit() : () => handleCreateIcon()}
              sx={{ borderRadius: '30px' }}
            >
              {editId ? 'Update' : 'Add'}
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={methods} onSubmit={handleCreateIcon}>
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
                {iconData?.image ? (
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
                        typeof iconData?.image === 'string'
                          ? iconData?.image
                          : URL.createObjectURL(iconData?.image)
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
              Title
            </Typography>

            <RHFTextField
              fullWidth
              variant="filled"
              settingStateValue={handleTheme}
              name="title"
              value={iconData?.title || ''}
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
              name="category"
              id="demo-simple-select2"
              value={iconData?.category || types[0]}
              settingStateValue={handleTheme}
            >
              {iconCategories?.map((type: any, index: any) => (
                <MenuItem key={index} value={type?.id}>
                  {type?.name}
                </MenuItem>
              ))}
            </RHFSelect>
            {/* <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            URL
                        </Typography>

                        <RHFTextField
                            variant="filled"
                            fullWidth
                            settingStateValue={handleTheme}
                            name="url"
                            value={iconData?.url || ''}
                            type='url'
                        /> */}
          </Box>
        </FormProvider>
      </DetailsNavBar>
      <DetailsNavBar
        open={iconCategoryDrawer}
        onClose={handleCategoryDrawerClose}
        title={'Add Icon Category'}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={isSubmitting}
              onClick={
                editCategoryId
                  ? () => handleEditPost()
                  : () => handleCreateCategory(iconCategoryData)
              }
              sx={{ borderRadius: '30px' }}
            >
              {editCategoryId ? 'Update' : 'Add'}
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={categoryMethods}>
          <Box width="100%">
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Name
            </Typography>

            <RHFTextField
              fullWidth
              variant="filled"
              settingStateValue={handleCategoryData}
              name="name"
              value={iconCategoryData?.name || ''}
            />
          </Box>
        </FormProvider>
      </DetailsNavBar>
      <Grid container spacing={2} sx={{ padding: '16px' }}>
        {iconsData
          ?.filter((item: any) => item?.category?.['_id'].includes(selectedType))
          .map((el: any) => (
            <IconCard
              setIconData={seticonData}
              // setEditId={setEditId}
              toggleDrawerCommon={toggleDrawerCommon}
              key={el._id}
              id={el._id}
              image={el.image}
              title={el.title}
              type={el?.category?.name}
            />
          ))}
      </Grid>
    </Container>
  );
};

export default page;
