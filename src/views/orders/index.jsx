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
  TextField,
  DialogActions,
  MenuItem,
  Divider
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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

  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const orders = Array.isArray(data?.data) ? data.data : [];

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    shippingName: '',
    status: ''
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;

    await deleteOrder(id);
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

      const res = await updateOrder({
        id: selectedOrder.id || selectedOrder.orderId,
        ...payload
      }).unwrap();

      console.log('UPDATED:', res);

      setOpen(false);
    } catch (err) {
      console.log('UPDATE ERROR:', err);
    }
  };

  if (isLoading) {
    return <SpinnerLoader text="Loading Orders..." />;
  }

  return (
    <Box p={isMobile ? 2 : 3}>
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
                    onClick={() => handleDelete(order.id || order.orderId)}
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
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Edit Order</DialogTitle>

          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                value={form.shippingName}
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

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>

            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
