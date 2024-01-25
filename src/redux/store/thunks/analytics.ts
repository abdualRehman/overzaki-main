import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAllReducers } from './resetSlice';
import {
  getRequest,
  endpoints,
  defaultConfig,
  postRequest,
  putRequest,
  deleteRequest,
  IRequest,
} from 'src/utils/axios';

export interface IAnalyticsForm extends IRequest {
  name: string;
  balance: number;
  // examples
}
export const fetchAnalyticsGlobal = createAsyncThunk('analytics/fetchCustomer', async () => {
  const response = await getRequest(endpoints.analytic.global, defaultConfig());

  return response;
});
export const fetchAnalyticsOrder = createAsyncThunk('analytics/fetchCustomer', async () => {
  const response = await getRequest(endpoints.analytic.order, defaultConfig());

  return response;
});

// export const fetchAnalyticsSummary = createAsyncThunk(
//   'analytics/fetchSummary',
//   async (analyticsId: number) => {
//     const response = await getRequest(
//       `${endpoints.analytic.summary}/${analyticsId}`,
//       defaultConfig()
//     );

//     return response.data;
//   }
// );

// export const fetchAnalyticsVouchers = createAsyncThunk(
//   'analytics/fetchVouchers',
//   async (data: IAnalyticsForm) => {
//     const response = await postRequest(endpoints.analytic.vouchers, data, defaultConfig());

//     return response.data;
//   }
// );

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    list: [],
    analytics: null,
    loading: false,
    error: null as string | null,
    status: 'idle',
  },
  reducers: {
    setAnalytics: (state, action: PayloadAction<any>) => {
      state.analytics = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(resetAllReducers, (state) => {
        // Reset the state for the customers reducer
        state.status = 'idle';
        state.list = []; // Replace with your initial state
      })
      .addCase(fetchAnalyticsGlobal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsGlobal.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAnalyticsGlobal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message !== undefined ? action.error.message : null;
      })

      .addCase(fetchAnalyticsOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalyticsOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message !== undefined ? action.error.message : null;
      });

    // .addCase(fetchAnalyticsVouchers.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(fetchAnalyticsVouchers.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // .addCase(fetchAnalyticsVouchers.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message !== undefined ? action.error.message : null;
    // });
  },
});
export const { setAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
