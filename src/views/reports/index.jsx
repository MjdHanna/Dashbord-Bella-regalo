import React from 'react';
import { Box, Card, Typography, Stack, Button, Avatar, Chip } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

import { useTheme } from '@mui/material/styles';

import { useGetMessagesQuery, useDeleteMessageMutation, useMarkMessageAsReadMutation } from '../../redux/features/services/baseApi';

export default function Reports() {
  const theme = useTheme();

  const { data, isLoading, refetch } = useGetMessagesQuery();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();

  const messages = Array.isArray(data?.data) ? data.data : [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await deleteMessage(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRead = async (item) => {
    if (item.isRead === '1') return;

    try {
      await markAsRead(item.id).unwrap();
      refetch(); // 🔥 هذا هو الحل الحقيقي
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Typography p={3}>Loading messages...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 3, background: theme.palette.grey[50] }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          📩 Reports / Messages
        </Typography>

        <Chip label={`${messages.length} messages`} color="primary" />
      </Stack>

      {/* LIST */}
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
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                transition: '0.3s',

                background: isRead ? '#fff' : '#fff8e1',
                border: isRead ? '1px solid #eee' : '2px solid #ffcc80',

                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              {/* ICON */}
              <Avatar sx={{ bgcolor: isRead ? theme.palette.primary.main : '#ff9800' }}>
                <EmailIcon />
              </Avatar>

              {/* CONTENT */}
              <Box flex={1}>
                {/* USER */}
                <Stack direction="row" alignItems="center" gap={1}>
                  <PersonIcon fontSize="small" />
                  <Typography fontWeight={600}>{item.userName}</Typography>

                  <Chip label={isRead ? 'Read' : 'Unread'} size="small" color={isRead ? 'success' : 'warning'} />
                </Stack>

                {/* CONTACT */}
                <Typography variant="body2" color="text.secondary">
                  📧 {item.email}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  📞 {item.phoneNumber}
                </Typography>

                {/* SUBJECT */}
                <Typography variant="subtitle2" mt={1} fontWeight={600}>
                  {item.subject}
                </Typography>

                {/* MESSAGE */}
                <Typography variant="body2" mt={1}>
                  {item.message}
                </Typography>

                {/* DATE */}
                <Typography variant="caption" color="text.secondary">
                  {item.createdAt}
                </Typography>
              </Box>

              {/* DELETE */}
              {/* ACTIONS */}
              <Stack direction="row" spacing={1}>
                {/* MARK AS READ */}
                {!isRead && (
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRead(item);
                    }}
                    sx={{ borderRadius: 3 }}
                  >
                    Mark as Read
                  </Button>
                )}

                {/* DELETE */}
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  sx={{ borderRadius: 3 }}
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
