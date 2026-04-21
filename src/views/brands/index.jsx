import React, { useState } from 'react';
import { Box, Button, Card, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Avatar } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation
} from '../../redux/features/services/baseApi';

export default function Brands() {
  const theme = useTheme();

  const { data, isLoading } = useGetBrandsQuery();

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    logo: null
  });

  // ✅ حل المشكلة هنا
  const brands = Array.isArray(data?.data) ? data.data : [];

  const resetForm = () => {
    setForm({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      logo: null
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo') {
      setForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpen = (item = null) => {
    setEditing(item);

    if (item) {
      setForm({
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        descriptionEn: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        logo: null
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

    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editing) {
        await updateBrand({ id: editing.id, formData }).unwrap();
      } else {
        await createBrand(formData).unwrap();
      }

      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;

    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!brands.length) {
    return (
      <Box p={3}>
        <Typography>No brands found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50],
        p: 3
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          🏷️ Brands
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 3,
            px: 3,
            background: theme.palette.primary.main
          }}
        >
          Add Brand
        </Button>
      </Stack>

      <Stack spacing={2}>
        {brands.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
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
              src={item.logo}
              variant="rounded"
              sx={{
                width: 90,
                height: 90,
                mr: 2,
                background: theme.palette.secondary.main
              }}
            />

            <Box flex={1}>
              <Typography variant="h6" fontWeight={600}>
                {item.nameEn} / {item.nameAr}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.descriptionEn}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.descriptionAr}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpen(item)} sx={{ borderRadius: 3 }}>
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(item.id)}
                sx={{ borderRadius: 3 }}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Brand' : 'Add Brand'}</DialogTitle>

        <DialogContent>
          <TextField fullWidth label="Name EN" name="nameEn" value={form.nameEn} onChange={handleChange} sx={{ mb: 2 }} />

          <TextField fullWidth label="Name AR" name="nameAr" value={form.nameAr} onChange={handleChange} sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Description EN"
            name="descriptionEn"
            value={form.descriptionEn}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description AR"
            name="descriptionAr"
            value={form.descriptionAr}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <input type="file" name="logo" onChange={handleChange} />
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
