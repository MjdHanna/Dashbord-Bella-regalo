import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Occasions', 'Brands', 'Categories', 'Messages', 'Users', 'Orders', 'Vendors', 'Drivers', 'Products'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://cdb-back.bw-businessworld.net/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');
      return headers;
    }
  }),

  endpoints: (builder) => ({
    // ================= AUTH =================
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),

    logout: builder.mutation({
      query: () => ({
        url: 'logout',
        method: 'DELETE'
      })
    }),

    // ================= OCCASIONS =================

    getOccasions: builder.query({
      query: () => 'admin/admin-occasions',
      providesTags: ['Occasions']
    }),

    getOccasionById: builder.query({
      query: (id) => `admin/admin-occasions/${id}`
    }),

    createOccasion: builder.mutation({
      query: (formData) => ({
        url: 'admin/add-occasion',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Occasions']
    }),

    updateOccasion: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/edit-occasion/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Occasions']
    }),

    deleteOccasion: builder.mutation({
      query: (id) => ({
        url: `admin/delete-occasion/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Occasions']
    }),
    // ================= OCCASIONS =================
    // ================= BRANDS =================

    getBrands: builder.query({
      query: () => 'admin/admin-brands',
      providesTags: ['Brands']
    }),

    createBrand: builder.mutation({
      query: (formData) => ({
        url: 'admin/add-brand',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Brands']
    }),

    updateBrand: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/edit-brand/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Brands']
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `admin/delete-brand/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Brands']
    }),
    // Brandssssssssssssssssssssss

    // ================= CATEGORIES =================

    getCategories: builder.query({
      query: () => 'admin/admin-categories',
      providesTags: ['Categories']
    }),

    createCategory: builder.mutation({
      query: (formData) => ({
        url: 'admin/add-category',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Categories']
    }),

    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/edit-category/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Categories']
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `admin/delete-category/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Categories']
    }),
    // Cateoriiiiieeeeeees
    // ================= REPORTS / MESSAGES =================

    getMessages: builder.query({
      query: () => 'admin/admin-messages',
      providesTags: ['Messages']
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `admin/admin-delete-message/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Messages']
    }),
    markMessageAsRead: builder.mutation({
      query: (id) => ({
        url: `admin/admin-messages/${id}`
      }),
      invalidatesTags: ['Messages']
    }),
    //End Reports
    // ================= USERS =================

    getUsers: builder.query({
      query: () => 'admin/admin-users',
      providesTags: ['Users']
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `admin/admin-delete-user/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    }),

    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/edit-user/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Users']
    }),
    //End Userrrrrrrrrrrrs

    // ================= ORDERS =================

    getOrders: builder.query({
      query: () => 'admin/admin-orders',
      providesTags: ['Orders']
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `admin/admin-delete-order/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Orders']
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `admin/edit-order/${id}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Orders']
    }),
    //End Ordersssssssss
    // ================= STATISTICS =================

    getStatistics: builder.query({
      query: (role) => (role === 'vendor' ? 'vendor/statistics' : 'admin/statistics')
    }),
    //End STATISTICS

    // ================= VENDORS =================

    getVendors: builder.query({
      query: () => 'admin/admin-vendors',
      providesTags: ['Vendors']
    }),

    getVendorById: builder.query({
      query: (id) => `admin/admin-vendors/${id}`
    }),

    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `admin/admin-delete-vendor/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Vendors']
    }),
    getPendingVendors: builder.query({
      query: () => 'admin/vendors/pending',
      providesTags: ['Vendors']
    }),

    approveVendor: builder.mutation({
      query: (id) => ({
        url: `admin/vendors/${id}/approve`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Vendors']
    }),

    rejectVendor: builder.mutation({
      query: (id) => ({
        url: `admin/vendors/${id}/reject`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Vendors']
    }),
    //End Vendorssssssss
    // ================= DRIVERS =================

    getDrivers: builder.query({
      query: () => 'admin/admin-drivers',
      providesTags: ['Drivers']
    }),

    createDriver: builder.mutation({
      query: (formData) => ({
        url: 'admin/admin-create-driver',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Drivers']
    }),

    updateDriver: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/admin-edit-driver/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Drivers']
    }),

    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `admin/admin-delete-driver/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Drivers']
    }),
    //End Driversssssssssssss

    // ================= PRODUCTS =================

    getProducts: builder.query({
      query: () => 'admin/admin-products',
      transformResponse: (response) => response.data,
      providesTags: ['Products']
    }),

    getProductById: builder.query({
      query: (id) => `admin/admin-products/${id}`
    }),

    createProduct: builder.mutation({
      query: (formData) => ({
        url: 'admin/admin-add-products',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Products']
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/admin-edit-product/${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Products']
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `admin/admin-delete-product/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    })
    //End productssssssssssss
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetOccasionsQuery,
  useGetOccasionByIdQuery,
  useCreateOccasionMutation,
  useUpdateOccasionMutation,
  useDeleteOccasionMutation,
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useMarkMessageAsReadMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useGetStatisticsQuery,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useDeleteVendorMutation,
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = baseApi;
