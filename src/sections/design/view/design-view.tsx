/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */

'use client';

import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
// components
import { paths } from 'src/routes/paths';
import Linker from 'src/sections/overview/subscription-plan/link';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
// import { createBuilder } from 'src/redux/store/thunks/builder';
import { useRouter } from 'next/navigation';
import AddTheme from './addTheme/add-theme';
import ThemeBusinessType from './addTheme/ThemeBusinessType';
import ThemeBusinessDetails from './addTheme/ThemeBusinessDetails';
import AppDetails from './addTheme/appDetails';
import AppLang from './addTheme/AppLang';
import { AppDispatch } from 'src/redux/store/store';
import io from 'socket.io-client';



const data = [
  {
    icon: 'ant-design:shopping-outlined',
    title: 'Market',
  },
  {
    icon: 'mdi:food-outline',
    title: 'Restaurant',
  },
  {
    icon: 'material-symbols:food-bank-outline',
    title: 'Groceries',
  },
  {
    icon: 'game-icons:flowers',
    title: 'Flowers',
  },
  {
    icon: 'material-symbols:health-and-beauty-outline',
    title: 'Beauty',
  },
  {
    icon: 'fluent-mdl2:shirt',
    title: 'Fashion',
  },
  {
    icon: 'fe:mobile',
    title: 'Electronics',
  },
  {
    icon: 'material-symbols:home-outline',
    title: 'Home',
  },
  {
    icon: 'fluent-mdl2:health',
    title: 'Health',
  },
  {
    icon: 'bi:book',
    title: 'Library',
  },
  {
    icon: 'octicon:gift-24',
    title: 'Gifts',
  },
  {
    icon: 'mdi:art',
    title: 'Art',
  },
  {
    icon: 'ri:football-fill',
    title: 'Sports',
  },
  {
    icon: 'map:furniture-store',
    title: 'Furniture',
  },
  {
    icon: 'material-symbols-light:toys-outline',
    title: 'Toys',
  },
  {
    icon: 'akar-icons:glasses',
    title: 'Optics',
  },
  {
    icon: 'ph:car',
    title: 'Cars',
  },
];
interface DesignMainProps {
  // Add any props if needed
}

const domain = "https://www.overzaki.io";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcxOTM0NjVhOWRkNGM1NmU0NDdhNjciLCJkZXZpY2VOYW1lIjoidW5pcXVlIGRldmljZSBuYW1lIiwiaWF0IjoxNzA1MDUzODAwLCJleHAiOjE3MDU5MTc4MDB9.shq2exbIUMymWZTwGbzFra7labzX28CPicHZ4Temjpo";
const socket = io(domain + '/design?token=' + token);

const DesignMain: React.FC<DesignMainProps> = () => {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  const [addData, setAddData] = useState<any>({});
  const [step, setStep] = useState<number>(1); // Explicitly specify the type as number

  useEffect(() => {

    if (step === 6) {
      handleCreateBuilder();
    }
  }, [step])


  const handleCreateBuilder = () => {
    console.log(addData);

    const formData = {
      ...addData,
      theme: "Default",
      appDescription: {
        en: '',
        ar: '',
      }
    }
    // router.push(paths.dashboard.design.themes(addData.BusinessType.toLowerCase()));
    // delete formData.type;
    // dispatch(createBuilder(formData)).then((response: any) => {
    //   if (response.meta.requestStatus === 'fulfilled') {
    //   }
    // });

  }


  return (
    <>
      {/* {step === 1 && (
        <AddTheme steps={step} setSteps={setStep} addData={addData} setAddData={setAddData} />
      )}
      {step === 2 && (
        <ThemeBusinessType steps={step} setSteps={setStep} addData={addData} setAddData={setAddData} />
      )}
      {step === 3 && (
        <ThemeBusinessDetails steps={step} setSteps={setStep} addData={addData} setAddData={setAddData} />
      )}
      {step === 4 && (
        <AppDetails steps={step} setSteps={setStep} addData={addData} setAddData={setAddData} />
      )}
      {step === 5 && (
        <AppLang steps={step} setSteps={setStep} addData={addData} setAddData={setAddData} />
      )} */}
      {/* <Box sx={{ height: '100%', transition: 'all .5', paddingBottom: '30px' }}>
        <Typography variant="h6" sx={{ padding: { xs: '5px', sm: '13px' } }}>
          Please Select a Category
        </Typography>

        <Grid container spacing={2} mt={2} px={2}>
          {data.map((item, indx) => (
            <Grid item key={indx} xs={6} sm={4} md={3}>
              <Linker path={paths.dashboard.design.themes(item.title.toLowerCase())}>
                <Box
                  sx={{
                    width: '100%',
                    height: '120px',
                    backgroundColor: 'rgb(134, 136, 163,.09)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    flexDirection: 'column',
                    transition: 'all .5s',
                    cursor: { xs: 'default', sm: 'pointer' },
                    '&:hover': {
                      backgroundColor: 'rgb(27, 252, 182)',
                    },
                  }}
                >
                  <Icon width={24} icon={item.icon} />
                  <Typography
                    component="h5"
                    variant="subtitle2"
                    sx={{ whiteSpace: 'pre-line', fontSize: '14px', fontWeight: 700 }}
                  >
                    {item.title}{' '}
                  </Typography>
                </Box>
              </Linker>
            </Grid>
          ))}
        </Grid>
      </Box>
     */}
    </>

  );
}

export default DesignMain;