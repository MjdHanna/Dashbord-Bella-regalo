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
  DialogContentText,
  DialogActions,
  Stack,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { useTheme } from '@mui/material/styles';

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Categories() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const isSaving = isCreating || isUpdating;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: ''
  });

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
        nameEn: item.nameEn || '',
        nameAr: item.nameAr || '',
        descriptionEn: item.descriptionEn || '',
        descriptionAr: item.descriptionAr || '',
        image: null
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (isSaving) return;
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
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
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء حفظ القسم';
      setToast({
        open: true,
        message: errorMessage
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteCategory(selectedDeleteId).unwrap();
      handleCloseDeleteDialog();
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء حذف القسم';
      setToast({
        open: true,
        message: errorMessage
      });
      handleCloseDeleteDialog();
    }
  };

  if (isLoading) return <SpinnerLoader text="Loading Categories..." />;

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.grey[50], p: isMobile ? 2 : 3 }}>
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="error" variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          📂 Categories
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} fullWidth={isMobile} sx={{ borderRadius: 3 }}>
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

              <Button
                fullWidth={isMobile}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleOpenDeleteDialog(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} mt={1}>
            <TextField fullWidth label="Name EN" name="nameEn" value={form.nameEn} onChange={handleChange} disabled={isSaving} />
            <TextField fullWidth label="Name AR" name="nameAr" value={form.nameAr} onChange={handleChange} disabled={isSaving} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description EN"
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={handleChange}
              disabled={isSaving}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description AR"
              name="descriptionAr"
              value={form.descriptionAr}
              onChange={handleChange}
              disabled={isSaving}
            />
            <Button variant="outlined" component="label" disabled={isSaving}>
              {form.image ? form.image.name : 'Upload Image'}
              <input hidden type="file" name="image" onChange={handleChange} />
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSaving ? 'Saving...' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 400,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.main,
              width: 56,
              height: 56,
              margin: '0 auto 12px auto'
            }}
          >
            <WarningAmberRoundedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Confirm category deletion
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete this category? You will not be able to restore it after deletion.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2, px: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={isDeleting}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            fullWidth
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 2 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
