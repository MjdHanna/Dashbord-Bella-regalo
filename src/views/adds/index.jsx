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
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useGetAddsQuery, useCreateAddMutation, useDeleteAddMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Adds() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetAddsQuery();
  const [createAdd, { isLoading: isCreating }] = useCreateAddMutation();
  const [deleteAdd, { isLoading: isDeleting }] = useDeleteAddMutation();

  const isSaving = isCreating;

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [toast, setToast] = useState({ open: false, message: '' });

  const [form, setForm] = useState({
    titleEn: '',
    titleAr: '',
    product_id: '',
    image: null
  });

  const adds = Array.isArray(data?.data) ? data.data : [];

  const resetForm = () => {
    setForm({ titleEn: '', titleAr: '', product_id: '', image: null });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    if (isSaving) return;
    setOpen(false);
    resetForm();
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    try {
      formData.append('titleEn', form.titleEn);
      formData.append('titleAr', form.titleAr);
      if (form.product_id) {
        formData.append('productId', form.product_id);
      }

      if (form.image) {
        formData.append('image', form.image);
      }

      await createAdd(formData).unwrap();
      handleClose();
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء الحفظ';
      setToast({ open: true, message: errorMessage });
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
      await deleteAdd(selectedDeleteId).unwrap();
      handleCloseDeleteDialog();
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء الحذف';
      setToast({ open: true, message: errorMessage });
      handleCloseDeleteDialog();
    }
  };

  if (isLoading) return <SpinnerLoader text="Loading Ads..." />;

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
          📢 Advertisements
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} fullWidth={isMobile}>
          Add Advertisement
        </Button>
      </Stack>

      <Stack spacing={2}>
        {adds.map((item) => (
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
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }
            }}
          >
            <Avatar src={item.image} variant="rounded" sx={{ width: isMobile ? '100%' : 120, height: isMobile ? 120 : 80 }}>
              {item.titleEn?.[0] || 'A'}
            </Avatar>

            <Box flex={1} width="100%">
              <Typography variant="h6" fontWeight={600}>
                {item.titleEn}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {item.titleAr}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight={500}>
                📦 مرتبط بـ: {item.product ? item.product.nameAr : 'بدون منتج'}
              </Typography>
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                fullWidth={isMobile}
                onClick={() => handleOpenDeleteDialog(item.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Advertisement</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title (English)"
            name="titleEn"
            value={form.titleEn}
            onChange={handleChange}
            disabled={isSaving}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="العنوان (بالعربية)"
            name="titleAr"
            value={form.titleAr}
            onChange={handleChange}
            disabled={isSaving}
            sx={{ mb: 2 }}
            dir="rtl"
          />
          <TextField
            fullWidth
            label="Product ID"
            name="product_id"
            type="number"
            value={form.product_id}
            onChange={handleChange}
            disabled={isSaving}
            sx={{ mb: 2 }}
            helperText="أدخل رقم (ID) المنتج المرتبط بهذا الإعلان"
          />
          <Typography variant="body2" sx={{ mb: 1 }}>
            Advertisement Image
          </Typography>
          <input type="file" name="image" onChange={handleChange} disabled={isSaving} accept="image/*" />
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
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 400, width: '100%' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Avatar
            sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.main, width: 56, height: 56, margin: '0 auto 12px auto' }}
          >
            <WarningAmberRoundedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Confirm deletion
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete this ad? This action cannot be undone.
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
