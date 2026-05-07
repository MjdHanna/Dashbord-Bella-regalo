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
  MenuItem
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useGetOrdersQuery, useDeleteOrderMutation, useUpdateOrderMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';
export default function Orders() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetOrdersQuery();
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

      if (form.shippingName?.trim()) payload.shippingName = form.shippingName;

      if (form.shippingPhone?.trim()) payload.shippingPhone = form.shippingPhone;

      if (form.shippingAddress?.trim()) payload.shippingAddress = form.shippingAddress;

      payload.status = form.status;
      const res = await updateOrder({
        id: selectedOrder.id,
        ...payload
      }).unwrap();

      console.log('UPDATED:', res);
      setOpen(false);
    } catch (err) {
      console.log('UPDATE ERROR:', err);
    }
  };

  if (isLoading) return <SpinnerLoader text="Loading Orders..." />;

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
            key={order.id}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              p: 2,
              gap: 2
            }}
          >
            <Avatar>
              <ShoppingCartIcon />
            </Avatar>

            <Box flex={1} width="100%">
              <Typography fontWeight={600}>{order.orderNumber}</Typography>
              <Typography variant="body2">👤 {order.customerName}</Typography>
              <Typography variant="body2">💰 ${order.total}</Typography>
              <Typography variant="body2">📅 {order.createdAt}</Typography>

              <Chip label={order.status} size="small" sx={{ mt: 1 }} variant="outlined" />
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
              <Button fullWidth={isMobile} variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditOpen(order)}>
                Edit
              </Button>

              <Button
                fullWidth={isMobile}
                color="error"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(order.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit Order</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={form.shippingName} onChange={(e) => setForm({ ...form, shippingName: e.target.value })} />
            <TextField label="Phone" value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} />
            <TextField
              label="Address"
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
            />

            <TextField select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
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
    </Box>
  );
}
