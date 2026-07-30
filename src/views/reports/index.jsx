import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import { useTheme } from '@mui/material/styles';

import { useGetMessagesQuery, useDeleteMessageMutation, useMarkMessageAsReadMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Reports() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading, refetch } = useGetMessagesQuery();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const messages = Array.isArray(data?.data) ? data.data : [];

  const handleOpenDeleteDialog = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeleteId) {
      await deleteMessage(selectedDeleteId);
      handleCloseDeleteDialog();
    }
  };

  const handleRead = async (item) => {
    if (item.isRead === '1') return;
    await markAsRead(item.id);
    refetch();
  };

  if (isLoading) return <SpinnerLoader text="Loading Reports..." />;

  return (
    <Box sx={{ minHeight: '100vh', p: isMobile ? 2 : 3, background: theme.palette.grey[50] }}>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="space-between" mb={4}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
          📩 Reports / Messages
        </Typography>

        <Chip label={`${messages.length} messages`} color="primary" variant="outlined" />
      </Stack>

      <Stack spacing={2}>
        {messages.map((item) => {
          const isRead = Number(item.isRead) === 1;

          return (
            <Card
              key={item.id}
              sx={{
                p: 2,
                borderRadius: 4,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 2,
                background: isRead ? '#fff' : '#fff8e1',
                border: isRead ? '1px solid #eee' : '2px solid #ffcc80'
              }}
            >
              <Avatar sx={{ bgcolor: isRead ? theme.palette.primary.main : '#ff9800' }}>
                <EmailIcon />
              </Avatar>

              <Box flex={1} width="100%">
                <Stack direction="row" alignItems="center" gap={1}>
                  <PersonIcon fontSize="small" />
                  <Typography fontWeight={600}>{item.userName}</Typography>

                  <Chip label={isRead ? 'Read' : 'Unread'} size="small" color={isRead ? 'success' : 'warning'} />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  📧 {item.email}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  📞 {item.phoneNumber}
                </Typography>

                <Typography variant="subtitle2" mt={1} fontWeight={600}>
                  {item.subject}
                </Typography>

                <Typography variant="body2" mt={1}>
                  {item.message}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.createdAt}
                </Typography>
              </Box>

              <Stack direction={isMobile ? 'column' : 'row'} spacing={1} width={isMobile ? '100%' : 'auto'}>
                {!isRead && (
                  <Button fullWidth={isMobile} variant="outlined" color="success" onClick={() => handleRead(item)}>
                    Mark as Read
                  </Button>
                )}

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
          );
        })}
      </Stack>
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
            Confirm Deletion
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete this message? You cannot undo this action later.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2, px: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined" color="inherit" fullWidth sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" fullWidth autoFocus sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
