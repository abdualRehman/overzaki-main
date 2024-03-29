// apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from 'src/auth/context/jwt/utils';
import { RootState } from '../store';

export const api = createApi({
    reducerPath: 'overzaki',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://www.overzaki.io/api',
        prepareHeaders: (headers, { getState }) => {
            const state: RootState = getState() as any
            headers.set('Authorization', `Bearer ${getCookie('accessToken')}`);
            headers.set('x-tenant-id', state?.selectedDomain?.data?.domain)
            return headers;
        }
    }),
    tagTypes: ['Theme', 'Style', 'Icon', 'StyleCat', 'IconCat', 'plan', 'product'],
    endpoints: (builder) => ({
        getThemeById: builder.query({
            query: (themeId) => `/app-theme/${themeId}`,
            providesTags: ['Theme'],
        }),
        addNewTheme: builder.mutation({
            query: (theme) => ({
                url: '/app-theme',
                body: theme,
                method: "POST"
            }),
            invalidatesTags: ['Theme'],
        }),
        getAllThemes: builder.query({
            query: (type) => type ? `/app-theme/all?filter=${type}` : `/app-theme/all`,
            providesTags: ['Theme'],
        }),
        updateTheme: builder.mutation({
            query: ({ id, theme }) => ({
                url: `/app-theme/${id}`,
                method: 'PUT',
                body: theme,
            }),
            invalidatesTags: ['Theme'],
        }),
        deleteTheme: builder.mutation({
            query: (themeId) => ({
                url: `/app-theme/${themeId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Theme'],
        }),
        // Style Endpoints
        getStyleById: builder.query({
            query: (styleId) => `/app-style/${styleId}`,
            providesTags: ['Style'],
        }),
        addNewStyle: builder.mutation({
            query: (style) => ({
                url: '/app-style',
                body: style,
                method: "POST"
            }),
            invalidatesTags: ['Style'],
        }),
        getAllStyles: builder.query({
            query: (type) => type ? `/app-style/all?filter=${type}` : `/app-style/all`,
            providesTags: ['Style'],
        }),
        updateStyle: builder.mutation({
            query: ({ id, ...style }) => ({
                url: `/app-style/${id}`,
                method: 'PUT',
                body: style,
            }),
            invalidatesTags: ['Style'],
        }),
        deleteStyle: builder.mutation({
            query: (styleId) => ({
                url: `/app-style/${styleId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Style'],
        }),
        // style categoury
        addNewStyleCategoury: builder.mutation({
            query: (style) => ({
                url: '/style-category',
                body: style,
                method: "POST"
            }),
            invalidatesTags: ['StyleCat'],
        }),
        getAllStyleCategoury: builder.query({
            query: () => `style-category/all`,
            providesTags: ['StyleCat'],
        }),
        deleteStyleCategoury: builder.mutation({
            query: (id) => ({
                url: `style-category/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['StyleCat'],
        }),
        updateStyleCategoury: builder.mutation({
            query: (data) => ({
                url: `style-category/${data.id}`,
                method: "PUT",
                body: data.data
            }),
            invalidatesTags: ['StyleCat'],
        }),
        // Icon Endpoints
        getIconById: builder.query({
            query: (iconId) => `/app-icon/${iconId}`,
            providesTags: ['Icon'],
        }),
        addNewIcon: builder.mutation({
            query: (icon) => ({
                url: '/app-icon',
                body: icon,
                method: "POST"
            }),
            invalidatesTags: ['Icon'],
        }),
        getAllIcons: builder.query({
            query: (type) => type ? `/app-icon/all?filter=${type}` : '/app-icon/all',
            providesTags: ['Icon'],
        }),
        updateIcon: builder.mutation({
            query: ({ id, ...icon }) => ({
                url: `/app-icon/${id}`,
                method: 'PUT',
                body: icon,
            }),
            invalidatesTags: ['Icon'],
        }),
        deleteIcon: builder.mutation({
            query: (iconId) => ({
                url: `/app-icon/${iconId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Icon'],
        }),
        // icons categoury
        addNewIconCategoury: builder.mutation({
            query: (style) => ({
                url: '/icon-category',
                body: style,
                method: "POST"
            }),
            invalidatesTags: ['IconCat'],
        }),
        getAllIconCategoury: builder.query({
            query: () => `icon-category/all`,
            providesTags: ['IconCat'],
        }),
        deleteIconCategoury: builder.mutation({
            query: (id) => ({
                url: `icon-category/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['IconCat'],
        }),
        updateIconCategoury: builder.mutation({
            query: (data) => ({
                url: `icon-category/${data.id}`,
                method: "PUT",
                body: data.data
            }),
            invalidatesTags: ['IconCat'],
        }),
        // DNS management
        setDomain: builder.mutation({
            query: (data) => ({
                url: `/zone/set_new_domain`,
                method: 'POST',
                body: data
            }),
        }),
        domainChecker: builder.mutation({
            query: (data) => ({
                url: `/zone/domain_checker`,
                method: 'POST',
                body: data
            }),
        }),
        checkDomainValidation: builder.mutation({
            query: (data) => ({
                url: `/domain-managment/check_availability`,
                method: 'POST',
                headers: {
                    'x-tenant-id': data.tanant_id
                },
                body: {
                    domain: data.domain
                }
            }),
        }),
        payDomain: builder.mutation({
            query: (data) => ({
                url: `/zone/init_purchase_domain`,
                method: 'POST',
                body: data
            }),
        }),
        getLastDomain: builder.query({
            query: (builderId) => ({
                url: `/zone/builder/${builderId}`,
            }),
        }),
        // customer management
        getCustomerAnalytics: builder.query({
            query: (data) => ({
                url: `/customers/anyltic`,
                headers: {
                    'x-tenant-id': data
                }
            }),
        }),
        // plans managment
        getPlansByCat: builder.query({
            query: (category) => ({
                url: `/plans/by_category?category=${category}`,
            }),
            providesTags: ['plan']
        }),
        updatePlan: builder.mutation({
            query: (data) => ({
                url: `/plans/${data.id}`,
                method: 'PUT',
                body: {
                    name: data.name,
                    price: data.price
                }
            }),
            invalidatesTags: ['plan']
        }),
        addNewFeature: builder.mutation({
            query: (data) => ({
                url: `/feature`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['plan']
        }),
        getAllFeaturesByCat: builder.query({
            query: (category) => ({
                url: `/feature?category=${category}`,
            }),
            providesTags: ['plan']
        }),
        UpdateFeature: builder.mutation({
            query: (data) => ({
                url: `/feature/${data.id}`,
                method: 'PUT',
                body: {
                    content: data.content,
                    availableForPro: data.availableForPro,
                    availableForFree: data.availableForFree,
                }
            }),
            invalidatesTags: ['plan']
        }),
        // builder details
        getBuilderDetails: builder.query({
            query: (id) => ({
                url: `/builder/${id}`,
            }),
        }),
        // upgrade plan
        upgradePlan: builder.mutation({
            query: (data) => ({
                url: `/plan-subscription/upgrade_plan`,
                method: 'PUT',
                body: data
            }),
        }),
        // products
        getAllProducts: builder.query({
            query: (domain) => ({
                url: `/products`,
                method: "GET",
                headers: {
                    'x-tenant-id': domain
                }
            }),
            providesTags: ['product']
        }),
        getProduct: builder.query({
            query: ({domain , id}) => ({
                url: `/products/${id}`,
                method: "GET",
                headers: {
                    'x-tenant-id': domain
                }
            }),
            providesTags: ['product']
        }),
        createProduct: builder.mutation({
            query: ({ domain, data }) => ({
                url: `/products`,
                method: 'POST',
                headers: {
                    'x-tenant-id': domain
                },
                body: data
            }),
            invalidatesTags: ['product']
        }),
        updateProduct: builder.mutation({
            query: ({ domain, data , id }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                headers: {
                    'x-tenant-id': domain
                },
                body: data
            }),
            invalidatesTags: ['product']
        }),
    }),
});

export type Api = typeof api;


export const {
    // themes
    useAddNewThemeMutation,
    useGetAllThemesQuery,
    useDeleteThemeMutation,
    useGetThemeByIdQuery,
    useUpdateThemeMutation,
    // style
    useAddNewStyleMutation,
    useGetAllStylesQuery,
    useDeleteStyleMutation,
    useGetStyleByIdQuery,
    useUpdateStyleMutation,
    // style categoury
    useAddNewStyleCategouryMutation,
    useGetAllStyleCategouryQuery,
    useDeleteStyleCategouryMutation,
    useUpdateStyleCategouryMutation,
    // icons
    useAddNewIconMutation,
    useGetAllIconsQuery,
    useDeleteIconMutation,
    useGetIconByIdQuery,
    useUpdateIconMutation,
    // icons categoury
    useAddNewIconCategouryMutation,
    useGetAllIconCategouryQuery,
    useDeleteIconCategouryMutation,
    useUpdateIconCategouryMutation,
    // DNS management
    useSetDomainMutation,
    useDomainCheckerMutation,
    useGetLastDomainQuery,
    useCheckDomainValidationMutation,
    usePayDomainMutation,
    // customer management
    useGetCustomerAnalyticsQuery,
    // plans management
    useGetPlansByCatQuery,
    useUpdatePlanMutation,
    useAddNewFeatureMutation,
    useGetAllFeaturesByCatQuery,
    useUpdateFeatureMutation,
    // plan sub
    useUpgradePlanMutation,
    // builder
    useGetBuilderDetailsQuery,
    // products
    useGetAllProductsQuery,
    useCreateProductMutation,
    useGetProductQuery,
    useUpdateProductMutation
} = api;