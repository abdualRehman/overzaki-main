/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';

// @mui
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import { Box, Grid, Stack, Typography, Paper, Alert, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';



// import { useRouter } from 'next/router';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/redux/store/store';
import { useSnackbar } from 'notistack';
// _mock
// import { allProducts } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { UploadBox } from 'src/components/upload';
import {
    createProduct,
    createVariant,
    deleteProduct,
    editProduct,
    editVariant,
    fetchOneProduct,
    fetchOneVariant,
    fetchProductsList,
    setProduct,
} from 'src/redux/store/thunks/products';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
import { BottomActions } from 'src/components/bottom-actions';
//
import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify/iconify';

import DetailsNavBar from '../DetailsNavBar';
import ProductTableToolbar from '../product-table-toolbar';




// ----------------------------------------------------------------------

export default function OrdersListView() {
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();
    const categoryState = useSelector((state: any) => state.category);
    const loadStatus = useSelector((state: any) => state.products.status);
    const { list, error, product, variant } = useSelector((state: any) => state.products);

    const [productData, setProductData] = useState<any>(null);
    const [editProductId, setEditProductId] = useState<any>(null);
    const [removeData, setRemoveData] = useState<any>(null);

    const settings = useSettingsContext();

    const [value, setValue] = useState<any>('All');
    const confirm = useBoolean();
    const [data, setData] = useState([]);

    const [errorMsg, setErrorMsg] = useState('');


    // const pathname = usePathname()
    // console.log("pathname", pathname);
    const router = usePathname();

    useEffect(() => {
        // const { id } = router.query
        console.log("id", router);
    }, [router]);


    const dialog = useBoolean();
    const rowDialog = useBoolean();




    const handleAddImage = (files: any) => {
        if (files.length > 0) {
            setProductData((prevData: any) => ({
                ...prevData,
                images: prevData.images ? [...prevData.images, files[0]] : [files[0]],
                // images: files[0]
            }));
        }
    };
    const handleRemoveImage = (index: any) => {
        setProductData((current: any) => {
            const { images, ...rest } = current;
            const updatedImages = images.filter((_: any, i: any) => i !== index);
            return {
                ...rest,
                images: updatedImages,
            };
        });
    };



    const convertStateToFormData = (state: any) => {
        const formData = new FormData();

        // Iterate over the properties of the state
        Object.entries(state).forEach(([key, value]: any) => {
            // this is only for the products and sending single image.
            // && key !== 'images'
            if (typeof value === 'object' && !Array.isArray(value) && key !== 'images') {
                Object.entries(value).forEach(([nestedKey, nestedValue]: any) => {
                    formData.append(`${key}[${nestedKey}]`, nestedValue);
                });
            } else if (Array.isArray(value)) {
                if (key === 'images') {
                    const newImages = value.filter((file) => typeof file !== 'string');
                    newImages.forEach((file: any, index: any) => {
                        formData.append(`${key}`, file);
                    });
                } else {
                    // If the value is an array, assume it's a file input
                    value.forEach((file: any, index: any) => {
                        formData.append(`${key}[${index}]`, file);
                    });
                }
            } else {
                // For other types of values
                formData.append(key, value);
            }
        });

        return formData;
    };

    const [tempVariantId, setTempVariantId] = useState<any>(null);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (newValue === 'All') {
            setData(list);
        } else {
            const newData = list.filter((order: any) => order?.categoryId === newValue);
            setData(newData);
        }
    };

    const [openDetails, setOpenDetails] = useState(false);
    const [openVariant, setOpenVariant] = useState(false);

    // common
    const toggleDrawerCommon =
        (state: string, id: any = null) =>
            (event: React.SyntheticEvent | React.MouseEvent) => {
                if (state === 'new') {
                    setOpenDetails((pv) => !pv);
                    setEditProductId(id);
                    if (id) {
                        dispatch(fetchOneProduct(id));
                    } else {
                        setProductData({});
                        dispatch(setProduct({}));
                    }
                } else if (state === 'variants') {
                    variantMethods.reset();
                    setOpenVariant((pv) => !pv);
                    dispatch(fetchOneVariant(id));
                    setTempVariantId(id);
                }
            };

    const handleDrawerCloseCommon =
        (state: string) => (event: React.SyntheticEvent | React.KeyboardEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            if (state === 'new') setOpenDetails(false);
            if (state === 'variants') {
                setOpenVariant(false);
                setTempVariantId(null);
            }
        };
    // -------------------------------------------------- Variants ---------------------

    const [variantData, setVariantData] = useState<any>(null);
    const [editVariantId, setEditVariantId] = useState(null);

    const VaiantSchema = Yup.object().shape({
        groupName: Yup.object().shape({
            en: Yup.string().required('English Name is required'),
            ar: Yup.string().required('Arabic Name is required'),
        }),
        selectionType: Yup.string().required('Field is required'),
        minimum: Yup.number().test({
            name: 'minimum',
            message: 'Field is required',
            test: (value: any, context: any) => {
                // console.log("value", value);
                if (context.parent?.selectionType === 'multiple' && !value) {
                    return false;
                }
                return true;
            },
        }),
        maximum: Yup.number().test({
            name: 'maximum',
            message: 'Field is required',
            test: (value: any, context: any) => {
                // console.log("selectionType", context.parent?.selectionType);
                if (context.parent?.selectionType === 'multiple' && !value) {
                    return false;
                }
                return true;
            },
        }),
    });

    const variantMethods = useForm({
        resolver: yupResolver(VaiantSchema),
    });

    const onVariantSubmit = variantMethods.handleSubmit(async (data) => {
        try {
            // console.log("tempVariantId", tempVariantId);
            // console.log("editVariantId", editVariantId);
            if (editVariantId) {
                await editVariantFun();
            } else {
                await createVariantFun();
            }
        } catch (error) {
            console.error(error);
            variantMethods.reset();
            setErrorMsg(typeof error === 'string' ? error : error.message);
        }
    });

    useEffect(() => {
        if (variant && variant.length > 0) {
            variantMethods.reset();

            setEditVariantId(tempVariantId);
            const firstVariant = variant[0];
            const newData = {
                groupName: {
                    en: firstVariant.groupName.en,
                    ar: firstVariant.groupName.ar,
                },
                allowMoreQuantity: firstVariant.allowMoreQuantity,
                maximum: firstVariant?.maximum || 0,
                minimum: firstVariant?.minimum || 0,
                selectionType: firstVariant.selectionType,
            };
            setVariantData(newData);
            Object.entries(newData).forEach(([fieldName, nestedData]: any) => {
                if (fieldName === 'groupName') {
                    Object.entries(nestedData).forEach(([nestedFieldName, value]: any) => {
                        const fullFieldName: string = `${fieldName}.${nestedFieldName}`;
                        variantMethods.setValue(fullFieldName as 'groupName.en' | 'groupName.ar', value);
                    });
                } else {
                    variantMethods.setValue(fieldName, nestedData);
                }
            });
        } else {
            variantMethods.reset();
            setVariantData(null);
            setEditVariantId(null);
        }
    }, [variant, variantMethods, tempVariantId]);

    const handleNestedVariantData = (e: any) => {
        const { name, value } = e.target;
        const [parentKey, nestedKey] = name.split('.');
        const obj = {
            ...variantData,
            groupName: {
                ...(variantData?.groupName || {}),
                [nestedKey]: value,
            },
        };
        setVariantData(obj);
    };
    const handleVariantData = (e: any) => {
        const { name, value } = e.target;
        setVariantData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleVariantCheckBox = (e: any, value: any) => {
        const { name, checked } = e.target;
        // console.log(name, checked);
        setVariantData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ------------
    const createVariantFun = () => {
        if (variantData && Object.entries(variantData).length > 0) {
            // console.log("variantData", tempVariantId);
            dispatch(createVariant({ productId: tempVariantId, data: variantData })).then(
                (response: any) => {
                    if (response.meta.requestStatus === 'fulfilled') {
                        variantMethods.reset();
                        setVariantData(null);
                        setEditVariantId(null);
                        handleDrawerCloseCommon('variants');

                        dispatch(fetchProductsList(error));
                        enqueueSnackbar('Successfully Created!', { variant: 'success' });
                    } else {
                        enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
                    }
                }
            );
        }
    };

    const editVariantFun = () => {
        if (variantData && Object.entries(variantData).length > 0) {
            dispatch(editVariant({ productId: tempVariantId, data: variantData })).then(
                (response: any) => {
                    if (response.meta.requestStatus === 'fulfilled') {
                        dispatch(fetchProductsList(error));
                        enqueueSnackbar('Successfully Updated!', { variant: 'success' });
                    } else {
                        enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
                    }
                }
            );
        }
    };

    // const removeProductFun = () => {
    //   if (removeData) {
    //     dispatch(deleteProduct(removeData)).then((response: any) => {
    //       if (response.meta.requestStatus === 'fulfilled') {
    //         dispatch(fetchProductsList(error));
    //         enqueueSnackbar('Successfully Deleted!', { variant: 'success' });
    //         confirm.onFalse();
    //       } else {
    //         enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
    //       }
    //     });
    //   }
    // }
    const listStuff = data;
    const [listItems, setListItems] = useState([]);
    useEffect(() => {
        setListItems(listStuff);
    }, [listStuff]);
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(listItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setListItems(items);
    };

    const imagesItrations = Array.from({ length: 3 }, (_, index) => index);
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Grid
                container
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
            >
                <Grid item xs={12} md="auto">
                    <CustomCrumbs heading="Variants" crums={false} />
                </Grid>

                <Grid item xs={12} md={5}>
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
                                // onClick={toggleDrawerCommon('variants')}
                                onClick={dialog.onTrue}
                            >
                                Add New Variant
                            </Button>
                        </Stack>
                    </BottomActions>
                </Grid>

                {/* <Grid item xs={12}>
                    <Box mt="20px">
                        <ProductTableToolbar />
                    </Box>
                </Grid> */}

                <Grid item xs={12}>
                    <Box>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    variant="scrollable"
                                    scrollButtons={false}
                                    onChange={handleChangeTab}
                                    sx={{
                                        px: 2.5,
                                        boxShadow: (theme) =>
                                            `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                                    }}
                                >
                                    <Tab
                                        iconPosition="end"
                                        value="All"
                                        label="All Products"
                                        icon={
                                            <Label variant={(value === 'All' && 'filled') || 'outlined'} color="primary">
                                                {list.length}
                                            </Label>
                                        }
                                    />
                                    {/* {categoryState.list.map((categoryObj: any) => (
                                        <Tab
                                            key={categoryObj._id}
                                            iconPosition="end"
                                            value={categoryObj._id}
                                            label={categoryObj?.name?.en || ''}
                                            icon={
                                                <Label
                                                    variant={(categoryObj._id === value && 'filled') || 'outlined'}
                                                    color="primary"
                                                >
                                                    {
                                                        list.filter((product: any) => product.categoryId === categoryObj._id)
                                                            .length
                                                    }
                                                </Label>
                                            }
                                        />
                                    ))} */}
                                </TabList>
                            </Box>

                            <TabPanel value={value} sx={{ px: 0 }}>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Droppable droppableId="items">
                                        {(provided) => (
                                            <Grid
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                container
                                                spacing={2}
                                            >
                                                {/* DND START */}
                                                {listItems.map((product: any, indx: any) => (
                                                    <Draggable key={indx} index={indx} draggableId={indx.toString()}>
                                                        {(provided) => (
                                                            <Grid
                                                                {...provided.draggableProps}
                                                                ref={provided.innerRef}
                                                                item
                                                                xs={12}
                                                            >
                                                                <Paper elevation={4}>
                                                                    <Grid
                                                                        container
                                                                        item
                                                                        alignItems="center"
                                                                        justifyContent="space-between"
                                                                        rowGap={3}
                                                                        sx={{ px: 3, py: { xs: 3, md: 0 }, minHeight: '110px' }}
                                                                    >
                                                                        <Grid item xs={12} md={6}>
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '8px',
                                                                                }}
                                                                            >
                                                                                <div {...provided.dragHandleProps}>
                                                                                    <Iconify icon="ci:drag-vertical" />
                                                                                </div>
                                                                                <Box
                                                                                    component="img"
                                                                                    src={product.images[0]}
                                                                                    alt=" "
                                                                                    width="60px"
                                                                                />
                                                                                <Box display="flex" gap="0px" flexDirection="column">
                                                                                    <Typography
                                                                                        component="p"
                                                                                        noWrap
                                                                                        variant="subtitle2"
                                                                                        sx={{
                                                                                            fontSize: '.9rem',
                                                                                            fontWeight: 800,
                                                                                            maxWidth: { xs: '100%', md: '188px' },
                                                                                        }}
                                                                                    >
                                                                                        {' '}
                                                                                        {product?.name?.en}{' '}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        component="p"
                                                                                        noWrap
                                                                                        variant="subtitle2"
                                                                                        sx={{
                                                                                            opacity: 0.7,
                                                                                            fontSize: '.9rem',
                                                                                            maxWidth: { xs: '100%', md: '188px' },
                                                                                        }}
                                                                                    >
                                                                                        {product.category}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Grid>

                                                                        <Grid item xs={12} md={6}>
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '8px',
                                                                                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    component="p"
                                                                                    variant="subtitle2"
                                                                                    sx={{ fontSize: '.8rem', fontWeight: 800 }}
                                                                                >
                                                                                    {' '}
                                                                                    {product.price} KWD{' '}
                                                                                </Typography>
                                                                                &nbsp; &nbsp;
                                                                                <Iconify
                                                                                    icon="mdi:pen-plus"
                                                                                    onClick={toggleDrawerCommon('variants', product._id)}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />{' '}
                                                                                &nbsp; &nbsp;
                                                                                <Iconify
                                                                                    icon="carbon:delete"
                                                                                    onClick={() => {
                                                                                        setRemoveData(product._id);
                                                                                        confirm.onTrue();
                                                                                    }}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />{' '}
                                                                                &nbsp; &nbsp;
                                                                                <Iconify
                                                                                    icon="bx:edit"
                                                                                    // onClick={toggleDrawerCommon('new', product._id)}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Paper>
                                                            </Grid>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </Grid>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Grid>
            </Grid>



            <DetailsNavBar
                open={openVariant}
                onClose={handleDrawerCloseCommon('variants')}
                title={editVariantId ? 'Edit Variant' : 'Add New Variant'}
                actions={
                    <Stack alignItems="center" justifyContent="center" spacing="10px">
                        <LoadingButton
                            fullWidth
                            variant="soft"
                            color="success"
                            size="large"
                            loading={variantMethods.formState.isSubmitting}
                            onClick={() => variantMethods.handleSubmit(onVariantSubmit as any)()}
                            sx={{ borderRadius: '30px' }}
                        >
                            {editVariantId ? 'Update' : 'Save'}
                        </LoadingButton>
                    </Stack>
                }
            >
                <FormProvider methods={variantMethods} onSubmit={onVariantSubmit}>
                    <Divider flexItem />
                    {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    <Box width="100%">
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Group Name (English)
                        </Typography>
                        <RHFTextField
                            fullWidth
                            variant="filled"
                            settingStateValue={handleNestedVariantData}
                            value={variantData?.groupName?.en || ''}
                            name="groupName.en"
                        />

                        <Typography
                            mt="20px"
                            mb="5px"
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Group Name (Arabic)
                        </Typography>

                        <RHFTextField
                            fullWidth
                            variant="filled"
                            settingStateValue={handleNestedVariantData}
                            value={variantData?.groupName?.ar || ''}
                            name="groupName.ar"
                        />

                        <Typography
                            mt="20px"
                            mb="5px"
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Selection Type
                        </Typography>

                        <RHFSelect
                            fullWidth
                            variant="filled"
                            name="selectionType"
                            id="demo-simple-select2"
                            value={variantData?.selectionType || ''}
                            settingStateValue={handleVariantData}
                        >
                            <MenuItem value="multiple">Multiple</MenuItem>
                            <MenuItem value="single">Single</MenuItem>
                        </RHFSelect>

                        {variantData?.selectionType === 'multiple' && (
                            <>
                                <Typography
                                    mt="20px"
                                    mb="5px"
                                    component="p"
                                    noWrap
                                    variant="subtitle2"
                                    sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                                >
                                    Minimum
                                </Typography>
                                <RHFTextField
                                    fullWidth
                                    type="number"
                                    variant="filled"
                                    settingStateValue={handleVariantData}
                                    value={variantData?.minimum || ''}
                                    name="minimum"
                                />

                                <Typography
                                    mt="20px"
                                    mb="5px"
                                    component="p"
                                    noWrap
                                    variant="subtitle2"
                                    sx={{ opacity: 0.7, fontSize: '.9rem' }}
                                >
                                    Maximum
                                </Typography>
                                <RHFTextField
                                    type="number"
                                    fullWidth
                                    variant="filled"
                                    settingStateValue={handleVariantData}
                                    value={variantData?.maximum || ''}
                                    name="maximum"
                                />
                            </>
                        )}

                        <Stack
                            mt="20px"
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                borderRadius: '16px',
                                padding: '7px 14px',
                                backgroundColor: '#F5F6F8',
                            }}
                        >
                            <Typography
                                component="p"
                                variant="subtitle2"
                                sx={{ fontWeight: 900, fontSize: '.9rem' }}
                            >
                                Allow More Quantity
                            </Typography>
                            <Checkbox
                                size="medium"
                                name="allowMoreQuantity"
                                checked={variantData?.allowMoreQuantity || false}
                                // onChange={(e: any) => setVariantData({ ...variantData, allowMoreQuantity: e.target.checked })}
                                onChange={handleVariantCheckBox}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            {/* <Switch size="medium"
                checked={!!variantData?.allowMoreQuantity}
                // onChange={(e: any) => setVariantData({ ...variantData, allowMoreQuantity: e.target.checked })}
                onChange={(e) => {
                  console.log('Previous variantData:', variantData);
                  setVariantData((prevData: any) => ({ ...prevData, allowMoreQuantity: !!e.target.checked }));
                  console.log('Updated variantData:', variantData);
                }}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              /> */}
                        </Stack>
                    </Box>
                </FormProvider>
            </DetailsNavBar>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                noCancel={false}
                content={<>Are you sure want to delete items?</>}
                action={
                    <Button
                        fullWidth
                        color="error"
                        variant="soft"
                        size="large"
                        // onClick={removeProductFun}
                        sx={{ borderRadius: '30px' }}
                    >
                        Delete
                    </Button>
                }
            />



            {/* create Variant Model */}
            <Dialog open={dialog.value} onClose={dialog.onFalse} scroll='body' maxWidth='xl' fullWidth >
                <DialogTitle>Add New Variant</DialogTitle>
                <DialogContent>
                    <FormProvider methods={variantMethods} onSubmit={onVariantSubmit}>
                        <Divider flexItem />
                        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                        <Grid container spacing={2}>
                            <Grid item sm={6}>
                                <Typography
                                    component="p"
                                    noWrap
                                    variant="subtitle2"
                                    sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                                >
                                    Group Name (English)
                                </Typography>
                                <RHFTextField
                                    fullWidth
                                    variant="filled"
                                    settingStateValue={handleNestedVariantData}
                                    value={variantData?.groupName?.en || ''}
                                    name="groupName.en"
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography
                                    mt="20px"
                                    mb="5px"
                                    component="p"
                                    noWrap
                                    variant="subtitle2"
                                    sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                                >
                                    Group Name (Arabic)
                                </Typography>

                                <RHFTextField
                                    fullWidth
                                    variant="filled"
                                    settingStateValue={handleNestedVariantData}
                                    value={variantData?.groupName?.ar || ''}
                                    name="groupName.ar"
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Typography
                                    mt="20px"
                                    mb="5px"
                                    component="p"
                                    noWrap
                                    variant="subtitle2"
                                    sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                                >
                                    Selection Type
                                </Typography>

                                <RHFSelect
                                    fullWidth
                                    variant="filled"
                                    name="selectionType"
                                    id="demo-simple-select2"
                                    value={variantData?.selectionType || ''}
                                    settingStateValue={handleVariantData}
                                >
                                    <MenuItem value="multiple">Multiple</MenuItem>
                                    <MenuItem value="single">Single</MenuItem>
                                </RHFSelect>

                                <Stack
                                    mt="20px"
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        borderRadius: '16px',
                                        padding: '7px 14px',
                                        backgroundColor: '#F5F6F8',
                                    }}
                                >
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        sx={{ fontWeight: 900, fontSize: '.9rem' }}
                                    >
                                        Allow More Quantity
                                    </Typography>
                                    <Checkbox
                                        size="medium"
                                        name="allowMoreQuantity"
                                        checked={variantData?.allowMoreQuantity || false}
                                        onChange={handleVariantCheckBox}
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item sm={6}>
                                {variantData?.selectionType === 'multiple' && (
                                    <>
                                        <Typography
                                            mt="20px"
                                            mb="5px"
                                            component="p"
                                            noWrap
                                            variant="subtitle2"
                                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                                        >
                                            Minimum
                                        </Typography>
                                        <RHFTextField
                                            fullWidth
                                            type="number"
                                            variant="filled"
                                            settingStateValue={handleVariantData}
                                            value={variantData?.minimum || ''}
                                            name="minimum"
                                        />

                                        <Typography
                                            mt="20px"
                                            mb="5px"
                                            component="p"
                                            noWrap
                                            variant="subtitle2"
                                            sx={{ opacity: 0.7, fontSize: '.9rem' }}
                                        >
                                            Maximum
                                        </Typography>
                                        <RHFTextField
                                            type="number"
                                            fullWidth
                                            variant="filled"
                                            settingStateValue={handleVariantData}
                                            value={variantData?.maximum || ''}
                                            name="maximum"
                                        />
                                    </>
                                )}
                            </Grid>
                            <Grid item sm={12}>
                                <Button
                                    startIcon="+"
                                    fullWidth
                                    sx={{ borderRadius: '30px', color: '#0F1349' }}
                                    component="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={rowDialog.onTrue}
                                >
                                    Add Row
                                </Button>
                            </Grid>
                            <Grid item sm={12}>
                                <Paper elevation={4}>
                                    <Grid
                                        container
                                        item
                                        alignItems="center"
                                        justifyContent="space-between"
                                        rowGap={3}
                                        sx={{ px: 3, py: { xs: 3, md: 0 }, minHeight: '110px' }}
                                    >
                                        <Grid item xs={12} md={6}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >

                                                <Iconify icon="ci:drag-vertical" />

                                                <Box
                                                    component="img"
                                                    // src={product.images[0]}
                                                    alt=" "
                                                    width="60px"
                                                    bgcolor="red"
                                                />
                                                <Box display="flex" gap="0px" flexDirection="column">
                                                    <Typography
                                                        component="p"
                                                        noWrap
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontSize: '.9rem',
                                                            fontWeight: 800,
                                                            maxWidth: { xs: '100%', md: '188px' },
                                                        }}
                                                    >

                                                        Product name
                                                    </Typography>
                                                    <Typography
                                                        component="p"
                                                        noWrap
                                                        variant="subtitle2"
                                                        sx={{
                                                            opacity: 0.7,
                                                            fontSize: '.9rem',
                                                            maxWidth: { xs: '100%', md: '188px' },
                                                        }}
                                                    >
                                                        Category
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                                                }}
                                            >
                                                <Typography
                                                    component="p"
                                                    variant="subtitle2"
                                                    sx={{ fontSize: '.8rem', fontWeight: 800 }}
                                                >
                                                    1200 kwd
                                                </Typography>
                                                &nbsp; &nbsp;
                                                <Iconify
                                                    icon="mdi:pen-plus"
                                                    style={{ cursor: 'pointer' }}
                                                />{' '}
                                                &nbsp; &nbsp;
                                                <Iconify
                                                    icon="carbon:delete"

                                                    style={{ cursor: 'pointer' }}
                                                />{' '}
                                                &nbsp; &nbsp;
                                                <Iconify
                                                    icon="bx:edit"
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>


                        </Grid>

                    </FormProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={dialog.onFalse} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>




            <Dialog open={rowDialog.value} onClose={rowDialog.onFalse} scroll='body' maxWidth='xl' fullWidth >
                <DialogTitle>Add New Row</DialogTitle>
                <Button
                    startIcon="+"
                    fullWidth
                    sx={{ borderRadius: '30px', color: '#0F1349' }}
                    component="button"
                    variant="contained"
                    color="primary"
                    onClick={toggleDrawerCommon('variants')}
                >
                    Add Row
                </Button>
                <DialogContent>
                    <FormProvider methods={variantMethods} onSubmit={onVariantSubmit}>
                        <Divider flexItem />
                        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                        <Box width="100%">
                            <Typography
                                component="p"
                                noWrap
                                variant="subtitle2"
                                sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                            >
                                Group Name (English)
                            </Typography>
                            <RHFTextField
                                fullWidth
                                variant="filled"
                                settingStateValue={handleNestedVariantData}
                                value={variantData?.groupName?.en || ''}
                                name="groupName.en"
                            />


                        </Box>
                    </FormProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={rowDialog.onFalse} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={rowDialog.onFalse} variant="contained">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
