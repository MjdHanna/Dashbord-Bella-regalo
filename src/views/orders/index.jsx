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

import { useGetOrdersQuery, useDeleteOrderMutation, useUpdateOrderMutation } from '../../redux/features/services/baseApi';

export default function Orders() {
  const theme = useTheme();

  const { data, isLoading } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const orders = Array.isArray(data?.data) ? data.data : [];

  // ===== Modal State =====
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    shippingName: '',
    status: ''
  });

  // ===== Delete =====
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;

    try {
      await deleteOrder(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Open Edit =====
  const handleEditOpen = (order) => {
    setSelectedOrder(order);

    setForm({
      shippingAddress: order.shippingAddress || '',
      shippingPhone: order.shippingPhone || '',
      shippingName: order.customerName || '',
      status: order.status || ''
    });

    setOpen(true);
  };

  // ===== Save Edit =====
  const handleSave = async () => {
    try {
      const payload = {
        shipping_name: String(form.shippingName || ''),
        shipping_phone: String(form.shippingPhone || ''),
        shipping_address: String(form.shippingAddress || ''),
        status: form.status || 'pending'
      };
      await updateOrder({
        id: selectedOrder.id,
        formData: payload
      }).unwrap();

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  if (isLoading) {
    return <Typography p={3}>Loading orders...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3, background: '#f5f7fa' }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          🛒 Orders Management
        </Typography>

        <Chip label={`${orders.length} orders`} color="primary" />
      </Stack>

      {/* LIST */}
      <Stack spacing={2}>
        {orders.map((order) => (
          <Card
            key={order.id}
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.85)',
              transition: '0.3s',

              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* ICON */}
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <ShoppingCartIcon />
            </Avatar>

            {/* INFO */}
            <Box flex={1}>
              <Typography fontWeight={600}>{order.orderNumber}</Typography>

              <Typography variant="body2" color="text.secondary">
                👤 {order.customerName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                💰 ${order.total}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                📅 {order.createdAt}
              </Typography>

              {/* STATUS */}
              <Chip
                label={order.status}
                color={order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'cancelled' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            {/* ACTIONS */}
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderRadius: 3 }} onClick={() => handleEditOpen(order)}>
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: 3 }}
                onClick={() => handleDelete(order.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit Order</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Customer Name"
              value={form.shippingName}
              onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
            />

            <TextField label="Phone" value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} />

            <TextField
              label="Address"
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
            />

            <TextField select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="delivered">delivered</MenuItem>
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
