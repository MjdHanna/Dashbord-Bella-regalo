import React from 'react';
import { Box, Card, Typography, Stack, Button, Avatar, Chip, useMediaQuery } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

import { useTheme } from '@mui/material/styles';

import { useGetMessagesQuery, useDeleteMessageMutation, useMarkMessageAsReadMutation } from '../../redux/features/services/baseApi';
import SpinnerLoader from '../../ui-component/SpinnerLoader';

export default function Reports() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading, refetch } = useGetMessagesQuery();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();

  const messages = Array.isArray(data?.data) ? data.data : [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await deleteMessage(id);
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
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
