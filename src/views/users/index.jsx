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
  TextField
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

import { useTheme } from '@mui/material/styles';

import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../redux/features/services/baseApi';

export default function Users() {
  const theme = useTheme();

  const { data, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');

  const users = Array.isArray(data?.data) ? data.data : [];

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= OPEN EDIT =================
  const handleOpenEdit = (user) => {
    setSelectedUser({
      ...user,
      originalEmail: user.email // مهم 🔥
    });

    setPassword('');
    setOpen(true);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append('name', selectedUser.name);
      formData.append('phoneNumber', selectedUser.phoneNumber || '');
      formData.append('gender', selectedUser.gender || '');

      // ✅ لا ترسل الإيميل إلا إذا تغير
      if (selectedUser.email !== selectedUser.originalEmail) {
        formData.append('email', selectedUser.email);
      }

      // ✅ لا ترسل الباسورد إلا إذا تم إدخاله
      if (password) {
        formData.append('password', password);
      }

      await updateUser({
        id: selectedUser.id,
        formData
      }).unwrap();

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Typography p={3}>Loading users...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3, background: '#f5f7fa' }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          👥 Users Management
        </Typography>

        <Chip label={`${users.length} users`} color="primary" />
      </Stack>

      {/* USERS LIST */}
      <Stack spacing={2}>
        {users.map((user) => (
          <Card
            key={user.id}
            sx={{
              p: 2,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: '0.3s',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.85)',

              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* AVATAR */}
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <PersonIcon />
            </Avatar>

            {/* INFO */}
            <Box flex={1}>
              <Typography fontWeight={600}>{user.name || 'No Name'}</Typography>

              <Typography variant="body2" color="text.secondary">
                📧 {user.email}
              </Typography>

              {user.phoneNumber && (
                <Typography variant="body2" color="text.secondary">
                  📞 {user.phoneNumber}
                </Typography>
              )}

              {user.gender && <Chip label={user.gender} size="small" sx={{ mt: 1 }} />}
            </Box>

            {/* ACTIONS */}
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderRadius: 3 }} onClick={() => handleOpenEdit(user)}>
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: 3 }}
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* ================= EDIT MODAL ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
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
            margin="normal"
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
            margin="normal"
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
            margin="normal"
            value={selectedUser?.gender || ''}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                gender: e.target.value
              })
            }
          />

          {/* ✅ PASSWORD FIELD */}
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Leave empty if you don't want to change password"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
