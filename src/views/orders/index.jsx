import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useGetOrdersQuery, useDeleteOrderMutation, useUpdateOrderMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';
import { useSelector } from 'react-redux';

export default function Orders() {
  const theme = useTheme();

  const user = useSelector((state) => state.auth.user);
  const role = user?.accountType;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetOrdersQuery(role);

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const orders = Array.isArray(data?.data) ? data.data : [];

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: ''
  });

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    shippingName: '',
    status: ''
  });

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteOrder(selectedDeleteId).unwrap();
      handleCloseDeleteDialog();
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء حذف الطلب';
      setToast({
        open: true,
        message: errorMessage
      });
      handleCloseDeleteDialog();
    }
  };

  const handleEditOpen = (order) => {
    setSelectedOrder(order);

    setForm({
      shippingAddress: order.shippingAddress || '',
      shippingPhone: order.shippingPhone || '',
      shippingName: order.shippingName || '',
      status: order.status || ''
    });

    setOpen(true);
  };

  const handleEditClose = () => {
    if (isUpdating) return;
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = async () => {
    try {
      const payload = {};

      if (form.shippingName?.trim()) {
        payload.shippingName = form.shippingName;
      }

      if (form.shippingPhone?.trim()) {
        payload.shippingPhone = form.shippingPhone;
      }

      if (form.shippingAddress?.trim()) {
        payload.shippingAddress = form.shippingAddress;
      }

      payload.status = form.status;

      await updateOrder({
        id: selectedOrder.id || selectedOrder.orderId,
        ...payload
      }).unwrap();

      setOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء تحديث الطلب';
      setToast({
        open: true,
        message: errorMessage
      });
    }
  };

  if (isLoading) {
    return <SpinnerLoader text="Loading Orders..." />;
  }

  return (
    <Box p={isMobile ? 2 : 3}>
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="error" variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" spacing={2} mb={4}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          🛒 Orders
        </Typography>

        <Chip label={`${orders.length} orders`} variant="outlined" />
      </Stack>

      <Stack spacing={2}>
        {orders.map((order) => (
          <Card
            key={order.id || order.orderId}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              gap: 2
            }}
          >
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'flex-start' : 'center'}>
              <Avatar>
                <ShoppingCartIcon />
              </Avatar>

              <Box flex={1} width="100%">
                <Typography fontWeight={700}>{order.orderNumber}</Typography>

                <Typography variant="body2">👤 {order.customerName}</Typography>

                <Typography variant="body2">📍 {order.shippingAddress}</Typography>

                <Typography variant="body2">💳 Payment: {order.paymentStatus || 'N/A'}</Typography>

                <Typography variant="body2">💰 ${role === 'vendor' ? order.vendorTotal : order.total}</Typography>

                <Typography variant="body2">📅 {role === 'vendor' ? order.date : order.createdAt}</Typography>

                <Chip label={order.status} size="small" sx={{ mt: 1 }} variant="outlined" />
              </Box>

              {role !== 'vendor' && (
                <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
                  <Button fullWidth={isMobile} variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditOpen(order)}>
                    Edit
                  </Button>

                  <Button
                    fullWidth={isMobile}
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDeleteDialog(order.id || order.orderId)}
                  >
                    Delete
                  </Button>
                </Stack>
              )}
            </Stack>

            {Array.isArray(order.items) && order.items.length > 0 && (
              <>
                <Divider />

                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Order Items
                  </Typography>

                  <Stack spacing={1}>
                    {order.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 1.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2
                        }}
                      >
                        <Typography fontWeight={600}>{item.product_name}</Typography>

                        <Typography variant="body2">SKU: {item.variant_sku}</Typography>

                        <Typography variant="body2">Quantity: {item.quantity}</Typography>

                        <Typography variant="body2">Price: ${item.price}</Typography>

                        <Typography variant="body2">Total: ${item.total}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </>
            )}
          </Card>
        ))}
      </Stack>
      {role !== 'vendor' && (
        <Dialog open={open} onClose={handleEditClose} fullWidth>
          <DialogTitle>Edit Order</DialogTitle>

          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                value={form.shippingName}
                disabled={isUpdating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shippingName: e.target.value
                  })
                }
              />

              <TextField
                label="Phone"
                value={form.shippingPhone}
                disabled={isUpdating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shippingPhone: e.target.value
                  })
                }
              />

              <TextField
                label="Address"
                value={form.shippingAddress}
                disabled={isUpdating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shippingAddress: e.target.value
                  })
                }
              />

              <TextField
                select
                label="Status"
                value={form.status}
                disabled={isUpdating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value
                  })
                }
              >
                <MenuItem value="pending">Pending</MenuItem>

                <MenuItem value="processing">Processing</MenuItem>

                <MenuItem value="delivered">Delivered</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleEditClose} disabled={isUpdating}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isUpdating}
              startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 400,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.main,
              width: 56,
              height: 56,
              margin: '0 auto 12px auto'
            }}
          >
            <WarningAmberRoundedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Confirm order deletion
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete this order? You will not be able to restore it after deletion.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2, px: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={isDeleting}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            fullWidth
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 2 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
