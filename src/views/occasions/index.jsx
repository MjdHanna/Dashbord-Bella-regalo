import React, { useState } from 'react';
import { Box, Button, Card, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Avatar } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
  useGetOccasionsQuery,
  useCreateOccasionMutation,
  useUpdateOccasionMutation,
  useDeleteOccasionMutation
} from '../../redux/features/services/baseApi';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Occasions() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetOccasionsQuery();

  const [createOccasion] = useCreateOccasionMutation();
  const [updateOccasion] = useUpdateOccasionMutation();
  const [deleteOccasion] = useDeleteOccasionMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
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
      setForm({
        nameEn: '',
        nameAr: '',
        descriptionEn: '',
        descriptionAr: '',
        image: null
      });
    }

    setOpen(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      if (editing) {
        await updateOccasion({ id: editing.id, formData }).unwrap();
      } else {
        await createOccasion(formData).unwrap();
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await deleteOccasion(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Box p={isMobile ? 2 : 3}>
      <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" spacing={isMobile ? 2 : 0} mb={4}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          🎉 Occasions
        </Typography>

        <Button fullWidth={isMobile} variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ borderRadius: 3 }}>
          Add Occasion
        </Button>
      </Stack>

      <Stack spacing={2}>
        {data?.data?.map((item) => (
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
              src={item.image}
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
