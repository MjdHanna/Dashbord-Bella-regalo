import React from 'react';
import { Box, Typography, Stack, Card, Avatar, Button, Chip } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';

import { useTheme } from '@mui/material/styles';

import { useGetVendorsQuery, useDeleteVendorMutation } from '../../redux/features/services/baseApi';

export default function Vendors() {
  const theme = useTheme();

  const { data, isLoading, refetch } = useGetVendorsQuery();
  const [deleteVendor] = useDeleteVendorMutation();

  const vendors = Array.isArray(data?.data) ? data.data : [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;

    try {
      await deleteVendor(id).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Typography p={3}>Loading vendors...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3, background: theme.palette.grey[50] }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          🏪 Vendors
        </Typography>

        <Chip label={`${vendors.length} vendors`} color="primary" />
      </Stack>

      {/* LIST */}
      <Stack spacing={2}>
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: '0.3s',

              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* LOGO */}
            <Avatar
              src={vendor.logo}
              sx={{
                width: 70,
                height: 70,
                borderRadius: 3,
                bgcolor: theme.palette.grey[200]
              }}
            >
              <StorefrontIcon />
            </Avatar>

            {/* CONTENT */}
            <Box flex={1}>
              {/* NAME */}
              <Typography fontWeight={700} fontSize={18}>
                {vendor.shopNameEn}
              </Typography>

              <Typography fontSize={14} color="text.secondary">
                {vendor.shopNameAr}
              </Typography>

              {/* DESCRIPTION */}
              <Typography mt={1} fontSize={13}>
                {vendor.descriptionEn}
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                {vendor.descriptionAr}
              </Typography>

              {/* PHONE */}
              <Stack direction="row" alignItems="center" gap={1} mt={1}>
                <PhoneIcon fontSize="small" />
                <Typography fontSize={13}>{vendor.phoneNumber}</Typography>
              </Stack>
            </Box>

            {/* ACTION */}
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(vendor.id)}
              sx={{ borderRadius: 3 }}
            >
              Delete
            </Button>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
