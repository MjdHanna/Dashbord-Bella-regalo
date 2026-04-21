import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import {
  useGetOccasionsQuery,
  useCreateOccasionMutation,
  useUpdateOccasionMutation,
  useDeleteOccasionMutation
} from '../../redux/features/services/baseApi';
import { useTheme } from '@mui/material/styles';
export default function Occasions() {
  const { data, isLoading } = useGetOccasionsQuery();

  const [createOccasion] = useCreateOccasionMutation();
  const [updateOccasion] = useUpdateOccasionMutation();
  const [deleteOccasion] = useDeleteOccasionMutation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    image: null
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ================= OPEN MODAL =================
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
    }

    setOpen(true);
  };

  // ================= SAVE =================
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('nameEn', form.nameEn);
    formData.append('nameAr', form.nameAr);
    formData.append('descriptionEn', form.descriptionEn);
    formData.append('descriptionAr', form.descriptionAr);

    if (form.image) {
      formData.append('image', form.image);
    }

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
      alert('Error saving');
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await deleteOccasion(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Box p={3} sx={{ backgroundColor: theme.palette.secondary.main}}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Occasions</Typography>

        <Button variant="contained" onClick={() => handleOpen()}>
          Add Occasion
        </Button>
      </Box>

      {/* ================= LIST ================= */}
      <Grid container spacing={2}>
        {data?.data?.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.nameEn}</Typography>
                <Typography variant="body2">{item.descriptionEn}</Typography>

                <Box mt={2} display="flex" gap={1}>
                  <Button size="small" onClick={() => handleOpen(item)}>
                    Edit
                  </Button>

                  <Button size="small" color="error" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= MODAL ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? 'Edit Occasion' : 'Add Occasion'}</DialogTitle>

        <DialogContent>
          <TextField fullWidth label="Name EN" name="nameEn" onChange={handleChange} value={form.nameEn} sx={{ mb: 2 }} />
          <TextField fullWidth label="Name AR" name="nameAr" onChange={handleChange} value={form.nameAr} sx={{ mb: 2 }} />
          <TextField fullWidth label="Desc EN" name="descriptionEn" onChange={handleChange} value={form.descriptionEn} sx={{ mb: 2 }} />
          <TextField fullWidth label="Desc AR" name="descriptionAr" onChange={handleChange} value={form.descriptionAr} sx={{ mb: 2 }} />

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
