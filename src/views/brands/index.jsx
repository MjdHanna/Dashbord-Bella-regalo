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
  Alert
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation
} from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Brands() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetBrandsQuery();

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

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
        nameEn: item.nameEn || '',
        nameAr: item.nameAr || '',
        descriptionEn: item.descriptionEn || '',
        descriptionAr: item.descriptionAr || '',
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

  const handleClose = () => {
    if (isSaving) return;
    setOpen(false);
    setEditing(null);
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
        await updateBrand({ id: editing.id, formData }).unwrap();
      } else {
        await createBrand(formData).unwrap();
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء حفظ العلامة التجارية';
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
      await deleteBrand(selectedDeleteId).unwrap();
      handleCloseDeleteDialog();
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء حذف العلامة التجارية';
      setToast({
        open: true,
        message: errorMessage
      });
      handleCloseDeleteDialog();
    }
  };

  if (isLoading) return <SpinnerLoader text="Loading brands..." />;

  return (
    <Box p={isMobile ? 2 : 3}>
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

      <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" spacing={2} mb={4}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          🏷️ Brands
        </Typography>

        <Button fullWidth={isMobile} variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ borderRadius: 3 }}>
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
                onClick={() => handleOpenDeleteDialog(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Brand' : 'Add Brand'}</DialogTitle>

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
              {form.logo ? form.logo.name : 'Upload Logo'}
              <input hidden type="file" name="logo" onChange={handleChange} />
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
            Confirm brand deletion
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete this brand? You will not be able to restore it after deletion.
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
