import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Avatar,
  useMediaQuery
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTheme } from '@mui/material/styles';

import {
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation
} from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';
export default function Drivers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetDriversQuery();

  const [createDriver] = useCreateDriverMutation();
  const [updateDriver] = useUpdateDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    image: null
  });

  const drivers = Array.isArray(data?.data) ? data.data : [];

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpen = (item = null) => {
    setEditing(item);

    if (item) {
      setForm({
        name: item.name,
        email: item.email,
        password: '',
        phoneNumber: item.phoneNumber || '',
        image: null
      });
    } else {
      resetForm();
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (editing) {

      if (form.name !== editing.name) {
        formData.append('name', form.name);
      }

      if (form.email !== editing.email) {
        formData.append('email', form.email);
      }

      if (form.phoneNumber !== editing.phoneNumber) {
        formData.append('phoneNumber', form.phoneNumber);
      }

      if (form.password) {
        formData.append('password', form.password);
      }

      if (form.image) {
        formData.append('image', form.image);
      }

      await updateDriver({
        id: editing.id,
        formData
      }).unwrap();
    } else {

      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phoneNumber', form.phoneNumber);

      if (form.password) {
        formData.append('password', form.password);
      }

      if (form.image) {
        formData.append('image', form.image);
      }

      await createDriver(formData).unwrap();
    }

    handleClose();
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await deleteDriver(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <SpinnerLoader text="Loading Drivers..." />;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.grey[50],
        p: isMobile ? 2 : 3
      }}
    >
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          🚗 Drivers
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} fullWidth={isMobile}>
          Add Driver
        </Button>
      </Stack>
      <Stack spacing={2}>
        {drivers.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2,
              p: 2,
              borderRadius: 4,
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Avatar
              src={item.profileImg}
              sx={{
                width: isMobile ? 55 : 70,
                height: isMobile ? 55 : 70
              }}
            >
              {item.name?.[0]}
            </Avatar>
            <Box flex={1} width="100%">
              <Typography variant="h6" fontWeight={600}>
                {item.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                📧 {item.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                📞 {item.phoneNumber || 'N/A'}
              </Typography>
            </Box>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
              <Button variant="outlined" startIcon={<EditIcon />} fullWidth={isMobile} onClick={() => handleOpen(item)}>
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                fullWidth={isMobile}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Driver' : 'Add Driver'}</DialogTitle>

        <DialogContent>
          <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} sx={{ mb: 2 }} />

          <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField fullWidth label="Phone" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} sx={{ mb: 2 }} />

          <input type="file" name="image" onChange={handleChange} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
