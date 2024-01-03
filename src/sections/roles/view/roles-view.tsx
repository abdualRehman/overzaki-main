/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import React, { useState, useCallback, useEffect } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
// @mui
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Switch,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
// _mock
// import { _orders, allRoles } from 'src/_mock';
// utils
import { fTimestamp } from 'src/utils/format-time';
// components
import { BottomActions } from 'src/components/bottom-actions';
import { useSettingsContext } from 'src/components/settings';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
import { useTable, getComparator } from 'src/components/table';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useSnackbar } from 'src/components/snackbar';
// types
import { IOrderItem, IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';
//
import {
  createRole,
  deleteRole,
  editRole,
  fetchOneRole,
  fetchRolesList,
  setRole,
} from 'src/redux/store/thunks/roles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/redux/store/store';
import { useBoolean } from 'src/hooks/use-boolean';
import { fetchProductsList } from 'src/redux/store/thunks/products';

import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
// import RolesToolbar from '../roles-toolbar';
// import RolesFiltersResult from '../roles-filters-result';
import DetailsNavBar from '../DetailsNavBar';

// .....
// ----------------------------------------------------------------------
const activeTab = {
  color: '#0F1349',
  background: 'rgb(209, 255, 240)',
  border: '2px solid #1AF9B3',
};
const nonActiveTab = {
  color: '#8688A3',
  background: 'rgb(245, 245, 248)',
};

const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  // { value: 'Active', label: 'Active' },
  // { value: 'Expired', label: 'Expired' },
];

const defaultFilters: IOrderTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};
const stylesActive = {
  cursor: { xs: 'default', md: 'pointer' },
  boxShadow: '0px 4px 20px #0F134914',
  borderRadius: '12px',
  border: '2px solid transparent',
  '&:hover': { borderColor: '#1BFCB6' },
  tranition: 'all .3s',
};
const stylesDisabled = {
  cursor: { xs: 'default', md: 'pointer' },
  background: '#F0F0F4',
  borderRadius: '12px',
  border: '2px solid transparent',
  tranition: 'all .3s',
};
// ----------------------------------------------------------------------

export default function RolesView() {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const productsState = useSelector((state: any) => state.products);
  const loadStatus = useSelector((state: any) => state.roles.status);
  const { list, error, role } = useSelector((state: any) => state.roles);
  const [editId, setEditId] = useState(null);
  const [removeData, setRemoveData] = useState<any>(null);
  const confirm = useBoolean();

  const [roleData, setRoleData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [productList, setProductList] = useState<any>([]);

  const [discountTypeToggle, setDiscountTypeToggle] = useState('FIXED_AMOUNT');
  const { copy } = useCopyToClipboard();
  const onCopy = (color: string) => {
    if (color) {
      enqueueSnackbar(`Copied! ${color}`);
      copy(color);
    }
  };

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const [value, setValue] = useState('All');

  // const [data, setData] = useState(allRoles)
  const [data, setData] = useState(list);

  // const [tableData] = useState(_orders);

  const [filters, setFilters] = useState(defaultFilters);
  const [roleStatus, setRoleStatus] = useState(true);

  // ----------------------------------------------------------------------------------

  const RoleSchema = Yup.object().shape({
    name: Yup.object().shape({
      en: Yup.string().required('English Name is required'),
      ar: Yup.string().required('Arabic Name is required'),
    }),
    code: Yup.string().required('Field is required'),
    discountAmount:
      discountTypeToggle === 'FIXED_AMOUNT'
        ? Yup.number().required('Field is required').typeError('Must be a valid number')
        : Yup.number().typeError('Must be a valid number'),
    discountPercentage:
      discountTypeToggle === 'PERCENTAGE'
        ? Yup.number().required('Field is required').typeError('Must be a valid number')
        : Yup.number().typeError('Must be a valid number'),
    upTo:
      discountTypeToggle === 'PERCENTAGE'
        ? Yup.number().required('Field is required').typeError('Must be a valid number')
        : Yup.number().typeError('Must be a valid number'),
    totalUses: Yup.number().required('Field is required').typeError('Must be a valid number'),
    availabitiyStarts: Yup.string().required('Field is required'),
    availabitiyEnds: Yup.string().required('Field is required'),
    coverage: Yup.array().test({
      name: 'coverage',
      message: 'Please select at least one option',
      test: (value: any) => {
        if (roleData?.converageAll) {
          return true;
        }
        return value && value.length > 0;
      },
    }),
  });

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editId) {
        console.log('data', roleData);
        await editRoleFun();
      } else {
        await createRoleFun();
      }
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  useEffect(() => {
    if (loadStatus === 'idle') {
      dispatch(fetchRolesList(error)).then((response: any) => {
        console.log(list);
        // setData(list)
      });
    }
  }, [loadStatus, dispatch, error, list]);

  useEffect(() => {
    if (productsState.status === 'idle') {
      dispatch(fetchProductsList(productsState.error)).then((response: any) => {
        console.log(response?.data?.data);
        // setProductList(response.data.data)
      });
    } else {
      setProductList(
        productsState.list.map((item: any) => ({
          value: item._id,
          label: item?.name?.en || item?.name,
        }))
      );
    }
  }, [productsState, dispatch]);

  useEffect(() => {
    setData(list || []);
  }, [list]);

  // reseting removeData value
  useEffect(() => {
    if (!confirm.value) {
      setRemoveData(null);
    }
  }, [confirm]);

  // Edit customer
  useEffect(() => {
    if (role) {
      if (role && Object.entries(role).length > 0) {
        // Convert the string dates to Date objects
        const startDate = new Date(role?.availabitiyStarts);
        const endDate = new Date(role?.availabitiyEnds);

        const updatedData = {
          name: {
            en: role?.name?.en || role?.name,
            ar: role?.name?.ar || role?.name,
          },
          code: role?.code,
          status: role?.status,
          discountAmount: role?.discountAmount,
          discountCurrency: role?.discountCurrency,
          discountPercentage: role?.discountPercentage,
          upTo: role?.upTo,
          totalUses: role?.totalUses,
          availabitiyStarts: startDate.toISOString().split('T')[0],
          availabitiyEnds: endDate.toISOString().split('T')[0],
          converageAll: role?.converageAll,
          coverage: role?.coverage,
        };
        setRoleData(updatedData);
        setDiscountTypeToggle(role?.type);
        Object.entries(updatedData).forEach(([fieldName, value]: any) => {
          if (fieldName === 'name') {
            methods.setValue('name.en', value.en);
            methods.setValue('name.ar', value.ar);
          } else {
            methods.setValue(fieldName, value);
          }
        });
      }
    } else {
      setDiscountTypeToggle('FIXED_AMOUNT');
      setRoleData(null);
      reset();
    }
  }, [role, methods, reset]);

  const handleRoleData = (e: any) => {
    setRoleData((prevData: any) => ({
      ...prevData,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    }));
  };
  const handleNestedRoleData = (e: any) => {
    const { name, value } = e.target;
    const [parentKey, nestedKey] = name.split('.');
    setRoleData((prevData: any) => ({
      ...prevData,
      [parentKey]: {
        ...(prevData[parentKey] || {}),
        [nestedKey]: value,
      },
    }));
  };

  const createRoleFun = () => {
    const fotmData = {
      ...roleData,
      status: roleData?.status || true,
      type: roleData?.type || discountTypeToggle,
      discountPercentage: roleData?.discountPercentage || 0,
      upTo: roleData?.upTo || 0,
      discountCurrency: roleData?.discountCurrency || 'KWD',
      converageAll: roleData?.converageAll || false,
    };
    if (fotmData) {
      dispatch(createRole(fotmData)).then((response: any) => {
        console.log(response);
        if (response.meta.requestStatus === 'fulfilled') {
          setRoleData(null);
          dispatch(fetchRolesList(error));
          enqueueSnackbar('Successfully Created!', { variant: 'success' });
        } else {
          enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
        }
      });
    }
  };

  const editRoleFun = () => {
    const fotmData = {
      ...roleData,
      status: roleData?.status || true,
      type: discountTypeToggle,
      discountPercentage: roleData?.discountPercentage || 0,
      upTo: roleData?.upTo || 0,
      discountCurrency: roleData?.discountCurrency || 'KWD',
      converageAll: roleData?.converageAll || false,
    };
    dispatch(editRole({ roleId: editId, data: fotmData })).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        dispatch(fetchRolesList(error));
        enqueueSnackbar('Successfully Updated!', { variant: 'success' });
      } else {
        enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
      }
    });
  };

  const removeRoleFun = () => {
    console.log('removeData', removeData);

    if (removeData) {
      dispatch(deleteRole(removeData)).then((response: any) => {
        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(fetchRolesList(error));
          enqueueSnackbar('Successfully Deleted!', { variant: 'success' });
          confirm.onFalse();
        } else {
          enqueueSnackbar(`Error! ${response.error.message}`, { variant: 'error' });
        }
      });
    }
  };

  // ----------------------------------------------------------------------------------
  // const dateError =
  //   filters.startDate && filters.endDate
  //     ? filters.startDate.getTime() > filters.endDate.getTime()
  //     : false;

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  //   dateError,
  // });

  // const canReset =
  //   !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  // const handleFilters = useCallback(
  //   (name: string, value: IOrderTableFilterValue) => {
  //     table.onResetPage();
  //     setFilters((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   },
  //   [table]
  // );

  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, []);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'All') {
      setData(list);
    } else {
      const newData = list.filter((order: any) =>
        newValue === 'Active' ? order.status : !order.status
      );
      setData(newData);
    }
  };

  // new order
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const toggleDrawerCommon =
    (state: string, id: any = null) =>
      (event: React.SyntheticEvent | React.MouseEvent) => {
        if (state === 'new') {
          setOpenCreateRole((pv) => !pv);
          setEditId(id);
          if (id) {
            dispatch(fetchOneRole(id));
          } else {
            setRoleData({});
            dispatch(setRole({}));
          }
        } else if (state === 'delete') {
          setOpenDelete((pv) => !pv);
        } else if (state === 'details') setOpenDetails((pv) => !pv);
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

      if (state === 'new') setOpenCreateRole(false);
      else if (state === 'details') setOpenDetails(false);
      else if (state === 'delete') setOpenDelete(false);
    };

  const [mySubCat, setMySubCat] = React.useState('All Products');

  const handleChangeMySubCat = (event: SelectChangeEvent) => {
    setMySubCat(event.target.value as string);
  };
  const listStuff = data;
  const [listItems, setListItems] = useState<any>([]);
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

  // -----
  const { verifyPermission } = useAuthContext();
  const [allowAction, setAllowAction] = useState<{ edit: boolean; remove: boolean }>({
    edit: false,
    remove: false,
  });
  const getPermission = async (moduleName: string, permissionName: string): Promise<void> => {
    try {
      const data = { permission: permissionName };
      const responseData = await verifyPermission?.(data);

      if (moduleName === 'edit') {
        setAllowAction((prevAllowAction) => ({ ...prevAllowAction, edit: responseData }));
      } else if (moduleName === 'remove') {
        setAllowAction((prevAllowAction) => ({ ...prevAllowAction, remove: responseData }));
      }
    } catch (error) {
      console.error(`Error while checking ${moduleName} permission:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPermission('edit', 'UPDATE_ROLE_BY_ID');
      await getPermission('remove', 'DELETE_ROLE_BY_ID');
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <RoleBasedGuard hasContent permission="GET_ROLES">
        <Grid
          container
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Grid item xs={12} md="auto">
            <CustomCrumbs heading="Roles" crums={false} />
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              spacing="20px"
            >
              {/* <Button startIcon={<Box component='img' src='/raw/orderreport.svg' />} fullWidth sx={{ borderRadius: '30px', color: '#8688A3', backgroundColor: '#F0F0F4' }} component='h5' variant='contained' color='primary' onClick={toggleDrawerCommon('analytics')}> Analytics </Button> */}
            </Stack>
            <RoleBasedGuard permission="CREATE_ROLE">
              <BottomActions>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems="center"
                  justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                  spacing="10px"
                  sx={{ width: '100%', maxWidth: { xs: '100%', sm: '200px' } }}
                >
                  <Button
                    startIcon="+"
                    fullWidth
                    sx={{ borderRadius: '30px', color: '#0F1349' }}
                    component="h5"
                    variant="contained"
                    color="primary"
                    onClick={toggleDrawerCommon('new')}
                  >
                    {' '}
                    Create New Role{' '}
                  </Button>
                </Stack>
              </BottomActions>
            </RoleBasedGuard>
          </Grid>

          <Grid item xs={12}>
            <Box mt="20px">
              {/* <RolesToolbar
                filters={filters}
                onFilters={handleFilters}
                //
                canReset={canReset}
                onResetFilters={handleResetFilters}
              /> */}

              {/* {canReset && (
                <RolesFiltersResult
                  filters={filters}
                  onFilters={handleFilters}
                  //
                  onResetFilters={handleResetFilters}
                  //
                  results={dataFiltered.length}
                  sx={{ p: 2.5, pt: 0 }}
                />
              )} */}
            </Box>
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
                      boxShadow: (theme) =>
                        `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                    }}
                  >
                    {STATUS_OPTIONS.map((tab) => (
                      <Tab
                        key={tab.value}
                        iconPosition="end"
                        value={tab.value}
                        label={tab.label}
                        icon={
                          <Label
                            variant={
                              ((tab.value === 'All' || tab.value === value) && 'filled') || 'soft'
                            }
                            color={
                              (tab.value === 'Active' && 'primary') ||
                              (tab.value === 'Ready' && 'secondary') ||
                              'default'
                            }
                          >
                            {tab.value === 'All' && list.length}
                            {tab.value === 'Expired' &&
                              list.filter((order: any) => !order.status).length}
                            {tab.value === 'Active' &&
                              list.filter((order: any) => order.status).length}
                          </Label>
                        }
                      />
                    ))}
                  </TabList>
                </Box>

                <TabPanel value={value} sx={{ px: 0, pb: 0 }}>
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="items">
                      {(provided) => (
                        <Grid
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          container
                          spacing={2}
                        >
                          {listItems.map((role: any, indx: any) => (
                            <Draggable key={indx} index={indx} draggableId={indx.toString()}>
                              {(provided) => (
                                <Grid
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                  key={indx}
                                  item
                                  xs={12}
                                >
                                  {/* <Paper elevation={4} > */}
                                  <Grid
                                    container
                                    item
                                    alignItems="center"
                                    justifyContent="space-between"
                                    rowGap={3}
                                    p={3}
                                    minHeight="80px"
                                    sx={role.status ? stylesActive : stylesDisabled}
                                  >
                                    <Grid
                                      item
                                      sx={{ display: 'flex', alignItems: 'end' }}
                                      xs={6}
                                      md="auto"
                                    >
                                      <div {...provided.dragHandleProps}>
                                        <Iconify icon="ci:drag-vertical" />
                                      </div>
                                      <Box sx={{ minWidth: { xs: 'auto', md: '140px' } }}>
                                        <Typography
                                          component="p"
                                          color="#8688A3"
                                          variant="subtitle2"
                                          sx={{ fontSize: '.8rem' }}
                                        >
                                          {role?.name?.en || role?.name}
                                        </Typography>
                                        {role.status ? (
                                          <Typography
                                            component="p"
                                            color="#0D6EFD"
                                            variant="subtitle2"
                                            sx={{
                                              mt: '5px',
                                              fontWeight: 900,
                                              cursor: 'pointer',
                                              fontSize: '.8rem',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '8px',
                                            }}
                                            onClick={() => onCopy(role.code)}
                                          >
                                            {role.code} <Iconify icon="tabler:copy" />{' '}
                                          </Typography>
                                        ) : (
                                          <Typography
                                            component="p"
                                            color="#8688A3"
                                            variant="subtitle2"
                                            sx={{ mt: '5px', fontWeight: 900, fontSize: '.8rem' }}
                                          >
                                            {role.code}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Grid>

                                    <Grid item xs={6} md="auto">
                                      <Typography
                                        component="p"
                                        color="#0F1349"
                                        variant="subtitle2"
                                        sx={{ fontSize: '.8rem' }}
                                      >
                                        {role.type === 'FIXED_AMOUNT'
                                          ? `${role.discountAmount} KWD`
                                          : `${role.discountPercentage}%`}{' '}
                                        <span style={{ fontSize: '.7rem' }}>({role.type})</span>{' '}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} md="auto">
                                      <Typography
                                        component="p"
                                        color="#0F1349"
                                        variant="subtitle2"
                                        sx={{ fontSize: '.8rem' }}
                                      >
                                        {role.totalUses} Uses{' '}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6} md="auto">
                                      <Box
                                        sx={{ display: 'flex', alignItems: 'center', gap: '13px' }}
                                      >
                                        <Box
                                          sx={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '20px',
                                            background: 'rgb(134, 136, 163,0.09)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                              background: 'rgb(134, 136, 163,0.2)',
                                            },
                                          }}
                                          // onClick={toggleDrawerCommon("delete", role._id)}
                                          onClick={() => {
                                            setRemoveData(role._id);
                                            confirm.onTrue();
                                          }}
                                        >
                                          {allowAction.remove && (
                                            <Box
                                              component="img"
                                              src="/raw/trash-can-solid.svg"
                                              width="13px"
                                            />
                                          )}
                                        </Box>
                                        <Box
                                          sx={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '20px',
                                            background: 'rgb(134, 136, 163,0.09)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                              background: 'rgb(134, 136, 163,0.2)',
                                            },
                                          }}
                                          onClick={toggleDrawerCommon('new', role._id)}
                                        >
                                          {allowAction.edit && (
                                            <Box
                                              component="img"
                                              src="/raw/edit-pen.svg"
                                              width="13px"
                                            />
                                          )}
                                        </Box>
                                        {/* <Switch checked={role.status} /> */}
                                      </Box>
                                    </Grid>
                                  </Grid>
                                  {/* </Paper> */}
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

              <DetailsNavBar
                open={openDetails}
                onClose={handleDrawerCloseCommon('details')}
                title="Role Details"
                actions={
                  <Button
                    fullWidth
                    variant="soft"
                    color="success"
                    size="large"
                    sx={{ borderRadius: '30px' }}
                  >
                    Save
                  </Button>
                }
              >
                <Divider flexItem />
                <Box width="100%">
                  <Typography
                    pb="5px"
                    component="p"
                    noWrap
                    variant="subtitle2"
                    sx={{ opacity: 0.7, fontSize: '.9rem' }}
                  >
                    Role Name (English)
                  </Typography>
                  <TextField fullWidth variant="filled" defaultValue="Happy Eid" name="NAME" />

                  <Typography
                    mt="20px"
                    pb="5px"
                    component="p"
                    noWrap
                    variant="subtitle2"
                    sx={{ opacity: 0.7, fontSize: '.9rem' }}
                  >
                    Role Name (Arabic)
                  </Typography>
                  <TextField fullWidth variant="filled" defaultValue="عيد سعيد" name="NAME" />

                  <Typography
                    mt="20px"
                    pb="5px"
                    component="p"
                    noWrap
                    variant="subtitle2"
                    sx={{ opacity: 0.7, fontSize: '.9rem' }}
                  >
                    Role Code
                  </Typography>
                  <TextField fullWidth variant="filled" defaultValue="H@PPYEID2023" name="Code" />

                  <Stack
                    mt="20px"
                    pb="5px"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        component="p"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.9rem' }}
                      >
                        Role Status
                      </Typography>
                      <Typography
                        component="p"
                        variant="subtitle2"
                        sx={{ fontWeight: 900, fontSize: '1rem' }}
                      >
                        Available
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Stack>

                  <Grid
                    container
                    mt="20px"
                    columnSpacing="20px"
                    pb="5px"
                    alignItems="flex-end"
                    rowGap="20px"
                    justifyContent="space-between"
                  >
                    <Grid item xs={6}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        Select Discount Type
                      </Typography>
                      <Box
                        sx={{
                          width: '100%',
                          height: '56px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8688A3',
                          fontSize: '.9rem',
                          background: 'rgb(245, 245, 248)',
                          borderRadius: '16px',
                          fontWeight: 800,
                        }}
                      >
                        Fixed Amount
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '56px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0F1349',
                          fontSize: '.9rem',
                          background: 'rgb(209, 255, 240)',
                          borderRadius: '16px',
                          fontWeight: 800,
                          border: '2px solid #1AF9B3',
                        }}
                      >
                        Percentage
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        Discount Percentage
                      </Typography>
                      <TextField fullWidth variant="filled" defaultValue="20%" name="Percentage" />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        Up to
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        defaultValue="10"
                        name="PHONE"
                        sx={{
                          '& .MuiInputAdornment-root': {
                            marginTop: '0px !important',
                          },
                          '& input': {
                            paddingRight: '0px !important',
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Stack direction="row" alignItems="center" spacing="5px">
                                <Typography
                                  component="p"
                                  variant="subtitle2"
                                  sx={{ opacity: 0.7, fontSize: '.6rem' }}
                                >
                                  KWD
                                </Typography>
                                <Iconify icon="mingcute:down-fill" width={20} />
                              </Stack>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        Total Uses
                      </Typography>
                      <TextField fullWidth variant="filled" defaultValue="500" name="PHONE" />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        Start Date
                      </Typography>
                      <TextField fullWidth variant="filled" defaultValue="2023-06-28" name="sd" />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        End Date
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        variant="filled"
                        defaultValue="2023-10-07"
                        name="ed"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="p"
                        mb="5px"
                        variant="subtitle2"
                        sx={{ opacity: 0.7, fontSize: '.8rem' }}
                      >
                        Role Coverage
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          variant="filled"
                          value={mySubCat}
                          sx={{
                            fontWeight: 900,
                          }}
                          onChange={handleChangeMySubCat}
                        // endAdornment={<div style={{ fontSize: '12px', marginRight: '20px', marginTop: '3px' }}>KWD</div>}
                        >
                          <MenuItem value="All Products">All Products</MenuItem>
                          <MenuItem value="Laptops">Laptops</MenuItem>
                          <MenuItem value="Clothes">Clothes</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </DetailsNavBar>

              {/* create new Vocher */}
              <DetailsNavBar
                open={openCreateRole}
                onClose={handleDrawerCloseCommon('new')}
                title={editId ? 'Edit Role' : 'Add New Role'}
                actions={
                  <Stack alignItems="center" justifyContent="center" spacing="10px">
                    <LoadingButton
                      fullWidth
                      variant="soft"
                      color="success"
                      size="large"
                      sx={{ borderRadius: '30px' }}
                      loading={isSubmitting}
                      onClick={() => methods.handleSubmit(onSubmit as any)()}
                    >
                      {editId ? 'Update' : 'Save'}
                    </LoadingButton>
                  </Stack>
                }
              >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Divider flexItem />
                  {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                  <Box width="100%">
                    <Typography
                      pb="5px"
                      component="p"
                      noWrap
                      variant="subtitle2"
                      sx={{ opacity: 0.7, fontSize: '.9rem' }}
                    >
                      Role Name (English)
                    </Typography>
                    {/* <TextField fullWidth variant='filled' defaultValue='Happy Eid' name='NAME' /> */}
                    <RHFTextField
                      fullWidth
                      variant="filled"
                      settingStateValue={handleNestedRoleData}
                      value={roleData?.name?.en || ''}
                      name="name.en"
                    />
                    <Typography
                      mt="20px"
                      pb="5px"
                      component="p"
                      noWrap
                      variant="subtitle2"
                      sx={{ opacity: 0.7, fontSize: '.9rem' }}
                    >
                      Role Name (Arabic)
                    </Typography>
                    {/* <TextField fullWidth variant='filled' defaultValue='عيد سعيد' name='NAME' /> */}
                    <RHFTextField
                      fullWidth
                      variant="filled"
                      settingStateValue={handleNestedRoleData}
                      value={roleData?.name?.ar || ''}
                      name="name.ar"
                    />

                    <Typography
                      mt="20px"
                      pb="5px"
                      component="p"
                      noWrap
                      variant="subtitle2"
                      sx={{ opacity: 0.7, fontSize: '.9rem' }}
                    >
                      Role Code
                    </Typography>
                    {/* <TextField fullWidth variant='filled' defaultValue="H@PPYEID2023" name='Code' /> */}
                    <RHFTextField
                      fullWidth
                      variant="filled"
                      settingStateValue={handleRoleData}
                      value={roleData?.code || ''}
                      name="code"
                    />

                    <Stack
                      mt="20px"
                      pb="5px"
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography
                          component="p"
                          variant="subtitle2"
                          sx={{ opacity: 0.7, fontSize: '.9rem' }}
                        >
                          Role Status
                        </Typography>
                        <Typography
                          component="p"
                          variant="subtitle2"
                          sx={{ fontWeight: 900, fontSize: '1rem' }}
                        >
                          Available
                        </Typography>
                      </Box>

                      {/* <Switch
                      checked={roleData?.status || true}
                      onChange={(e) => {
                        setRoleData({ ...roleData, status: e.target.checked })
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                      name='status'
                    /> */}
                      <RHFSwitch
                        label="status"
                        checked={roleData?.status || true}
                        onChange={(e: any) => {
                          console.log(e.target.checked);
                          setRoleData((prevData: any) => {
                            if (prevData && Object.entries(prevData).length > 0) {
                              return { ...roleData, status: e.target.checked };
                            }
                            return { status: e.target.checked };
                          });
                        }}
                        name="status"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    </Stack>

                    <Grid
                      container
                      mt="20px"
                      columnSpacing="20px"
                      pb="5px"
                      alignItems="flex-end"
                      rowGap="20px"
                      justifyContent="space-between"
                    >
                      <Grid item xs={6}>
                        <Typography
                          component="p"
                          mb="5px"
                          variant="subtitle2"
                          sx={{ opacity: 0.7, fontSize: '.8rem' }}
                        >
                          Select Discount Type
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '.9rem',
                            borderRadius: '16px',
                            fontWeight: 800,
                            ...(discountTypeToggle === 'FIXED_AMOUNT' ? activeTab : nonActiveTab),
                          }}
                          onClick={() => setDiscountTypeToggle('FIXED_AMOUNT')}
                        >
                          Fixed Amount
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '.9rem',
                            borderRadius: '16px',
                            fontWeight: 800,
                            ...(discountTypeToggle === 'PERCENTAGE' ? activeTab : nonActiveTab),
                          }}
                          onClick={() => setDiscountTypeToggle('PERCENTAGE')}
                        >
                          Percentage
                        </Box>
                      </Grid>

                      {discountTypeToggle === 'FIXED_AMOUNT' ? (
                        <Grid item xs={6}>
                          <Typography
                            component="p"
                            mb="5px"
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.8rem' }}
                          >
                            Discount Amount
                          </Typography>
                          <RHFTextField
                            type="number"
                            fullWidth
                            variant="filled"
                            settingStateValue={handleRoleData}
                            value={roleData?.discountAmount || ''}
                            name="discountAmount"
                            sx={{
                              '& .MuiInputAdornment-root': {
                                marginTop: '0px !important',
                              },
                              '& input': {
                                paddingRight: '0px !important',
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Stack direction="row" alignItems="center" spacing="5px">
                                    <Typography
                                      component="p"
                                      variant="subtitle2"
                                      sx={{ opacity: 0.7, fontSize: '.6rem' }}
                                    >
                                      KWD
                                    </Typography>
                                    <Iconify icon="mingcute:down-fill" width={20} />
                                  </Stack>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      ) : (
                        <>
                          <Grid item xs={6}>
                            <Typography
                              component="p"
                              mb="5px"
                              variant="subtitle2"
                              sx={{ opacity: 0.7, fontSize: '.8rem' }}
                            >
                              Discount Percentage
                            </Typography>
                            <RHFTextField
                              type="number"
                              fullWidth
                              variant="filled"
                              settingStateValue={handleRoleData}
                              value={roleData?.discountPercentage || ''}
                              name="discountPercentage"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              component="p"
                              mb="5px"
                              variant="subtitle2"
                              sx={{ opacity: 0.7, fontSize: '.8rem' }}
                            >
                              Up to
                            </Typography>
                            <RHFTextField
                              type="number"
                              fullWidth
                              variant="filled"
                              settingStateValue={handleRoleData}
                              value={roleData?.upTo || ''}
                              name="upTo"
                              sx={{
                                '& .MuiInputAdornment-root': {
                                  marginTop: '0px !important',
                                },
                                '& input': {
                                  paddingRight: '0px !important',
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Stack direction="row" alignItems="center" spacing="5px">
                                      <Typography
                                        component="p"
                                        variant="subtitle2"
                                        sx={{ opacity: 0.7, fontSize: '.6rem' }}
                                      >
                                        KWD
                                      </Typography>
                                      <Iconify icon="mingcute:down-fill" width={20} />
                                    </Stack>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}>
                        <Typography
                          component="p"
                          mb="5px"
                          variant="subtitle2"
                          sx={{ opacity: 0.7, fontSize: '.8rem' }}
                        >
                          Total Uses
                        </Typography>
                        <RHFTextField
                          type="number"
                          fullWidth
                          variant="filled"
                          settingStateValue={handleRoleData}
                          value={roleData?.totalUses || ''}
                          name="totalUses"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          component="p"
                          mb="5px"
                          variant="subtitle2"
                          sx={{ opacity: 0.7, fontSize: '.8rem' }}
                        >
                          Start Date
                        </Typography>
                        <RHFTextField
                          fullWidth
                          type="date"
                          variant="filled"
                          settingStateValue={handleRoleData}
                          value={roleData?.availabitiyStarts || ''}
                          name="availabitiyStarts"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          component="p"
                          mb="5px"
                          variant="subtitle2"
                          sx={{ opacity: 0.7, fontSize: '.8rem' }}
                        >
                          End Date
                        </Typography>
                        <RHFTextField
                          fullWidth
                          type="date"
                          variant="filled"
                          settingStateValue={handleRoleData}
                          value={roleData?.availabitiyEnds || ''}
                          name="availabitiyEnds"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          component="p"
                          mb="5px"
                          variant="subtitle2"
                          sx={{ opacity: 0.7, fontSize: '.8rem' }}
                        >
                          Role Coverage
                        </Typography>
                        <FormControl fullWidth>
                          {/* <Select
                          variant='filled'
                          sx={{
                            fontWeight: 900
                          }}
                          // value={mySubCat}
                          // onChange={handleChangeMySubCat}
                          value={roleData?.coverage || null}
                          onChange={handleRoleData}
                          name='coverage'
                        >
                          <MenuItem value='AllProducts'>All Products</MenuItem>
                          <MenuItem value='Laptops'>Laptops</MenuItem>
                          <MenuItem value='Clothes'>Clothes</MenuItem>
                        </Select> */}
                          <RHFMultiSelect
                            variant="filled"
                            checkbox
                            name="coverage"
                            label="Multi select"
                            options={productList}
                            settingStateValue={handleRoleData}
                            value={roleData?.coverage || []}
                          />
                        </FormControl>

                        <FormControlLabel
                          control={
                            <Checkbox
                              size="medium"
                              onChange={(e) => {
                                setRoleData({ ...roleData, converageAll: e.target.checked });
                              }}
                              name="converageAll"
                              color="primary"
                              checked={roleData?.converageAll || false}
                            />
                          }
                          label="All Products"
                        />
                      </Grid>
                    </Grid>

                    {/* <Typography mt='20px' mb='5px' component='p' noWrap variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem' }} >
                  Mobile Number
                </Typography>

                <TextField fullWidth variant='filled' defaultValue='965128743291' name='PHONE'
                  sx={{
                    '& .MuiInputAdornment-root': {
                      marginTop: '0px !important',
                      // paddingLeft: '10px'
                    },
                    '& input': {
                      paddingLeft: '2px !important'
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <Stack direction='row' alignItems='center' spacing="8px">
                        <Iconify icon="mingcute:down-fill" width={43} />
                        <Box component='img' src='/raw/flagN.png' />
                        <Divider orientation="vertical" variant='middle' flexItem />
                      </Stack>
                    </InputAdornment>,
                  }}
                /> */}

                    {/* <Typography mt='20px' mb='5px' component='p' noWrap variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem' }} >
                  Email Address (Optional)
                </Typography>
                <TextField fullWidth variant='filled' type='email' defaultValue='ahmed.omar@gmail.com' name='email' />


                <Typography mt='20px' mb='5px' component='p' noWrap variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem' }} >
                  Delivery Address
                </Typography>

                <Box sx={{ borderRadius: '12px', padding: '24px', background: 'rgb(245, 245, 248)' }}>
                  <Stack direction='row' alignItems='center' spacing='10px'>
                    <Iconify icon="ion:location" width={45} style={{ color: '#8688A3' }} />
                    <Typography component='p' variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem', fontWeight: 900 }} >
                      Ali Sabah Al-Salem - Block 5A - Street 8 House 4 - Floor 2
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: '22px' }} />
                  <Stack direction='row' alignItems='center' spacing='10px'>
                    <Iconify icon="mingcute:add-fill" width={30} style={{ color: '#8688A3' }} />
                    <Typography component='p' variant="subtitle2" sx={{ opacity: 0.7, fontSize: '.9rem', fontWeight: 900 }} >
                      Add Delivery Location
                    </Typography>
                  </Stack>

                </Box> */}
                  </Box>
                </FormProvider>
              </DetailsNavBar>

              <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                noCancel={false}
                maxWidth="sm"
                action={
                  <Button
                    fullWidth
                    color="error"
                    variant="soft"
                    size="large"
                    onClick={removeRoleFun}
                    sx={{ borderRadius: '30px' }}
                  >
                    Delete
                  </Button>
                }
                content={
                  <Grid container spacing="20px">
                    <Grid item xs={12} md={12}>
                      <Typography component="h5" variant="h5">
                        {' '}
                        Wana delete it ?
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography component="p" variant="subtitle2">
                        {' '}
                        Delete this Role ?
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
            </Box>
          </Grid>
        </Grid>
      </RoleBasedGuard>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IOrderItem[];
  comparator: (a: any, b: any) => number;
  filters: IOrderTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (order) =>
          fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(order.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
