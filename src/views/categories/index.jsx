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
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../../redux/features/services/baseApi';

export default function Categories() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetCategoriesQuery();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    image: null
  });

  const categories = Array.isArray(data?.data) ? data.data : [];

  const resetForm = () => {
    setForm({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
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
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        descriptionEn: item.descriptionEn,
        descriptionAr: item.descriptionAr,
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
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editing) {
        await updateCategory({ id: editing.id, formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Typography p={3}>Loading...</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.grey[50], p: isMobile ? 2 : 3 }}>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          📂 Categories
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} fullWidth={isMobile}>
          Add Category
        </Button>
      </Stack>
      <Stack spacing={2}>
        {categories.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2,
              p: 2,
              borderRadius: 4
            }}
          >
            <Avatar
              src={item.image}
              variant="rounded"
              sx={{
                width: isMobile ? 60 : 90,
                height: isMobile ? 60 : 90
              }}
            />

            <Box flex={1} width="100%">
              <Typography variant="h6">
                {item.nameEn} / {item.nameAr}
              </Typography>
              <Typography variant="body2">{item.descriptionEn}</Typography>
              <Typography variant="body2">{item.descriptionAr}</Typography>
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
              <Button fullWidth={isMobile} variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpen(item)}>
                Edit
              </Button>

              <Button fullWidth={isMobile} variant="contained" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>

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
