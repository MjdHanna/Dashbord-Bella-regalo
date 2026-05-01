import React, { useState } from 'react';
import { Box, Button, Card, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Avatar } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const brands = Array.isArray(data?.data) ? data.data : [];

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
      setForm({
        nameEn: '',
        nameAr: '',
        descriptionEn: '',
        descriptionAr: '',
        logo: null
      });
    }

    setOpen(true);
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

      setOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;

    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Typography p={3}>Loading...</Typography>;

  return (
    <Box p={isMobile ? 2 : 3}>
      <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" spacing={2} mb={4}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          🏷️ Brands
        </Typography>

        <Button fullWidth={isMobile} variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Brand
        </Button>
      </Stack>

      <Stack spacing={2}>
        {brands.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              p: 2,
              borderRadius: 4
            }}
          >
            <Avatar
              src={item.logo}
              variant="rounded"
              sx={{
                width: isMobile ? 70 : 90,
                height: isMobile ? 70 : 90,
                mb: isMobile ? 2 : 0,
                mr: isMobile ? 0 : 2
              }}
            />

            <Box flex={1} width="100%">
              <Typography fontWeight={600}>
                {item.nameEn} / {item.nameAr}
              </Typography>

              <Typography variant="body2">{item.descriptionEn}</Typography>
              <Typography variant="body2">{item.descriptionAr}</Typography>
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'} mt={isMobile ? 2 : 0}>
              <Button fullWidth={isMobile} variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpen(item)}>
                Edit
              </Button>

              <Button
                fullWidth={isMobile}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
