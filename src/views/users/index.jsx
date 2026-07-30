import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseIcon from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';

import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Users() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: ''
  });

  const users = Array.isArray(data?.data) ? data.data : [];

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id).unwrap();
      handleCloseDeleteDialog();
    } catch (error) {
      const errorMessage = error?.data?.message || error?.error || 'حدث خطأ أثناء حذف المستخدم';
      setToast({
        open: true,
        message: errorMessage
      });
      handleCloseDeleteDialog();
    }
  };

  const handleOpenEdit = (user) => {
    setSelectedUser({
      ...user,
      originalEmail: user.email,
      birth_date: user.birth_date || ''
    });

    setPassword('');
    setSelectedImage(null);

    if (user?.image) {
      setPreviewImage(user.image);
    } else {
      setPreviewImage('');
    }

    setOpen(true);
  };

  const handleCloseEdit = () => {
    if (isUpdating) return;
    setOpen(false);
    setSelectedUser(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append('name', selectedUser?.name || '');
      formData.append('phone_number', selectedUser?.phoneNumber || '');
      formData.append('gender', selectedUser?.gender || '');
      formData.append('email', selectedUser?.email || '');
      formData.append('birth_date', selectedUser?.birth_date || '');

      if (password.trim()) {
        formData.append('password', password);
      }

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await updateUser({
        id: selectedUser.id,
        formData
      }).unwrap();

      setOpen(false);
      setSelectedUser(null);
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || 'حدث خطأ أثناء تحديث بيانات المستخدم';
      setToast({
        open: true,
        message: errorMessage
      });
    }
  };

  if (isLoading) {
    return <SpinnerLoader text="Loading Users..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: isMobile ? 2 : 3,
        background: '#f5f7fa'
      }}
    >
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
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          👥 Users Management
        </Typography>

        <Chip label={`${users.length} users`} color="primary" variant="outlined" />
      </Stack>

      <Stack spacing={2}>
        {users.map((user) => (
          <Card
            key={user.id}
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2
            }}
          >
            <Avatar
              src={user?.image || ''}
              sx={{
                width: 70,
                height: 70,
                bgcolor: theme.palette.primary.main
              }}
            >
              {!user?.image && <PersonIcon />}
            </Avatar>

            <Box flex={1} width="100%">
              <Typography fontWeight={600}>{user.name || 'No Name'}</Typography>

              <Typography variant="body2">📧 {user.email}</Typography>

              {user.phoneNumber && <Typography variant="body2">📞 {user.phoneNumber}</Typography>}

              {user.birth_date && <Typography variant="body2">🎂 {user.birth_date}</Typography>}

              {user.gender && <Chip label={user.gender} size="small" sx={{ mt: 1 }} />}
            </Box>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
              <Button fullWidth={isMobile} variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenEdit(user)}>
                Edit
              </Button>

              <Button
                fullWidth={isMobile}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleOpenDeleteDialog(user)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={handleCloseEdit} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                src={previewImage || ''}
                sx={{
                  width: 120,
                  height: 120,
                  border: '3px solid #1976d2'
                }}
              >
                {!previewImage && <PersonIcon />}
              </Avatar>

              <Typography variant="body2" color="text.secondary">
                {selectedImage ? 'New image selected' : 'Current user image'}
              </Typography>

              <Button variant="outlined" component="label" disabled={isUpdating}>
                Change Image
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Name"
              disabled={isUpdating}
              value={selectedUser?.name || ''}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  name: e.target.value
                })
              }
            />

            <TextField
              fullWidth
              label="Email"
              disabled={isUpdating}
              value={selectedUser?.email || ''}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  email: e.target.value
                })
              }
            />

            <TextField
              fullWidth
              label="Phone"
              disabled={isUpdating}
              value={selectedUser?.phoneNumber || ''}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  phoneNumber: e.target.value
                })
              }
            />

            <TextField
              fullWidth
              label="Gender"
              disabled={isUpdating}
              value={selectedUser?.gender || ''}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  gender: e.target.value
                })
              }
            />

            <TextField
              fullWidth
              type="date"
              label="Birth Date"
              disabled={isUpdating}
              InputLabelProps={{
                shrink: true
              }}
              value={selectedUser?.birth_date || ''}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  birth_date: e.target.value
                })
              }
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              disabled={isUpdating}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button fullWidth={isMobile} onClick={handleCloseEdit} disabled={isUpdating}>
            Cancel
          </Button>

          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={handleUpdate}
            disabled={isUpdating}
            startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            textAlign: 'center'
          }
        }}
      >
        <IconButton
          onClick={handleCloseDeleteDialog}
          disabled={isDeleting}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Stack alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#ffebee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main'
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h6" fontWeight={700}>
              Confirm deletion
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete the user?{' '}
              <Box component="span" fontWeight={700} color="text.primary">
                "{userToDelete?.name || 'this user'}"
              </Box>{' '}
              This action cannot be undone later.
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
            sx={{ borderRadius: 2, py: 1 }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            disableElevation
            sx={{ borderRadius: 2, py: 1 }}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
