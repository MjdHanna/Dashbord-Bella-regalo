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
  useMediaQuery
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

import { useTheme } from '@mui/material/styles';

import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Users() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');

  const users = Array.isArray(data?.data) ? data.data : [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser({ ...user, originalEmail: user.email });
    setPassword('');
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append('name', selectedUser.name || '');

      formData.append('phone_number', selectedUser.phoneNumber || '');

      formData.append('gender', selectedUser.gender || '');

      formData.append('email', selectedUser.email || '');

      if (password.trim()) {
        formData.append('password', password);
      }

      const res = await updateUser({
        id: selectedUser.id,
        formData
      }).unwrap();

      console.log('UPDATE SUCCESS:', res);

      setOpen(false);
    } catch (err) {
      console.log('UPDATE ERROR:', err);
      console.log('ERROR DATA:', err?.data);
    }
  };
  if (isLoading) return <SpinnerLoader text="Loading Users..." />;

  return (
    <Box sx={{ minHeight: '100vh', p: isMobile ? 2 : 3, background: '#f5f7fa' }}>
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
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <PersonIcon />
            </Avatar>

            <Box flex={1} width="100%">
              <Typography fontWeight={600}>{user.name || 'No Name'}</Typography>

              <Typography variant="body2">📧 {user.email}</Typography>

              {user.phoneNumber && <Typography variant="body2">📞 {user.phoneNumber}</Typography>}

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
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />

          <TextField
            fullWidth
            label="Phone"
            margin="normal"
            value={selectedUser?.phoneNumber || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
          />

          <TextField
            fullWidth
            label="Gender"
            margin="normal"
            value={selectedUser?.gender || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button fullWidth={isMobile} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button fullWidth={isMobile} variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
