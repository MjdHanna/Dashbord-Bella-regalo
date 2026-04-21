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
export default function Occasions() {
  const { data, isLoading } = useGetOccasionsQuery();
  const theme = useTheme();
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

  // ================= INPUT =================
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ================= OPEN =================
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

  // ================= SAVE =================
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

  // ================= DELETE =================
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
    <Box p={3}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          🎉 Occasions
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 3,
            px: 3,
            background: '#2C687B'
          }}
        >
          Add Occasion
        </Button>
      </Stack>

      {/* LIST */}
      <Stack spacing={2}>
        {data?.data?.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 4,
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* IMAGE */}
            <Avatar
              src={item.image}
              variant="rounded"
              sx={{
                background: theme.palette.primary.main,
                width: 90,
                height: 90,
                mr: 2
              }}
            />

            {/* CONTENT */}
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

            {/* ACTIONS */}
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

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Occasion' : 'Add Occasion'}</DialogTitle>

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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
