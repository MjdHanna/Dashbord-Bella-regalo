import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Occasions', 'Brands', 'Categories', 'Messages'],

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
      tagTypes: ['Occasions']
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
    })
    //End Reports
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
  useMarkMessageAsReadMutation
} = baseApi;
