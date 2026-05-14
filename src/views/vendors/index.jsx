import React, { useState } from 'react';

import { Box, Typography, Stack, Card, Avatar, Button, Chip, useMediaQuery, Snackbar, Alert, CircularProgress } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';

import { useTheme } from '@mui/material/styles';

import {
  useGetVendorsQuery,
  useDeleteVendorMutation,
  useApproveVendorMutation,
  useRejectVendorMutation
} from '../../redux/features/services/baseApi';

export default function Vendors() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetVendorsQuery();

  const [deleteVendor] = useDeleteVendorMutation();
  const [approveVendor] = useApproveVendorMutation();
  const [rejectVendor] = useRejectVendorMutation();

  const vendors = Array.isArray(data?.data) ? data.data : [];

  const [loadingId, setLoadingId] = useState(null);
  const [actionType, setActionType] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;

    try {
      setLoadingId(id);
      setActionType('delete');

      const res = await deleteVendor(id).unwrap();

      showSnackbar(res?.message || 'Vendor deleted successfully');
    } catch (err) {
      showSnackbar(err?.data?.message || 'Failed to delete vendor', 'error');

      console.error(err);
    } finally {
      setLoadingId(null);
      setActionType('');
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoadingId(id);
      setActionType('approve');

      const res = await approveVendor(id).unwrap();

      showSnackbar(res?.message || 'Vendor approved successfully');
    } catch (err) {
      showSnackbar(err?.data?.message || 'Failed to approve vendor', 'error');

      console.error(err);
    } finally {
      setLoadingId(null);
      setActionType('');
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingId(id);
      setActionType('reject');

      const res = await rejectVendor(id).unwrap();

      showSnackbar(res?.message || 'Vendor rejected successfully');
    } catch (err) {
      showSnackbar(err?.data?.message || 'Failed to reject vendor', 'error');

      console.error(err);
    } finally {
      setLoadingId(null);
      setActionType('');
    }
  };

  if (isLoading) {
    return (
      <Typography p={3} fontWeight={600}>
        Loading vendors...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: isMobile ? 2 : 3,
        background: theme.palette.grey[50]
      }}
    >
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="space-between" mb={4}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          🏪 Vendors
        </Typography>

        <Chip label={`${vendors.length} vendors`} color="primary" variant="outlined" />
      </Stack>

      <Stack spacing={2}>
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2,
              transition: '0.3s',

              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Avatar
              src={vendor.logo}
              sx={{
                width: isMobile ? 60 : 70,
                height: isMobile ? 60 : 70,
                borderRadius: 3,
                bgcolor: theme.palette.grey[200]
              }}
            >
              <StorefrontIcon />
            </Avatar>

            <Box flex={1} width="100%">
              <Typography fontWeight={700} fontSize={isMobile ? 16 : 18}>
                {vendor.shopNameEn}
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                {vendor.shopNameAr}
              </Typography>

              <Typography mt={1} fontSize={13}>
                {vendor.descriptionEn}
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                {vendor.descriptionAr}
              </Typography>

              <Stack direction="row" alignItems="center" gap={1} mt={1}>
                <PhoneIcon fontSize="small" />

                <Typography fontSize={13}>{vendor.phoneNumber}</Typography>
              </Stack>
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>

              {vendor.status === 'approved' && (
                <Chip
                  label="Approved"
                  color="success"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3
                  }}
                />
              )}

              {vendor.status === 'rejected' && (
                <Chip
                  label="Rejected"
                  color="error"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3
                  }}
                />
              )}
              {vendor.status !== 'approved' && vendor.status !== 'rejected' && (
                <>
                  <Button
                    fullWidth={isMobile}
                    variant="contained"
                    color="success"
                    disabled={loadingId === vendor.id && actionType === 'approve'}
                    onClick={() => handleApprove(vendor.id)}
                    sx={{
                      borderRadius: 3
                    }}
                  >
                    {loadingId === vendor.id && actionType === 'approve' ? <CircularProgress size={22} color="inherit" /> : 'Approve'}
                  </Button>

                  <Button
                    fullWidth={isMobile}
                    variant="outlined"
                    color="error"
                    disabled={loadingId === vendor.id && actionType === 'reject'}
                    onClick={() => handleReject(vendor.id)}
                    sx={{
                      borderRadius: 3
                    }}
                  >
                    {loadingId === vendor.id && actionType === 'reject' ? <CircularProgress size={22} color="inherit" /> : 'Reject'}
                  </Button>
                </>
              )}
              <Button
                fullWidth={isMobile}
                variant="contained"
                color="error"
                startIcon={!(loadingId === vendor.id && actionType === 'delete') && <DeleteIcon />}
                disabled={loadingId === vendor.id && actionType === 'delete'}
                onClick={() => handleDelete(vendor.id)}
                sx={{
                  borderRadius: 3
                }}
              >
                {loadingId === vendor.id && actionType === 'delete' ? <CircularProgress size={22} color="inherit" /> : 'Delete'}
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false
          }))
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
