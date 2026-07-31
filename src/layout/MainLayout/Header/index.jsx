import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

import { IconMenu2 } from '@tabler/icons-react';

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 2 }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' } }}>
          <LogoSection />
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            color: theme.vars?.palette?.secondary?.dark || theme.palette.secondary.dark,
            background: theme.vars?.palette?.secondary?.light || theme.palette.secondary.light,
            '&:hover': {
              color: theme.vars?.palette?.secondary?.light || theme.palette.secondary.light,
              background: theme.vars?.palette?.secondary?.dark || theme.palette.secondary.dark
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Stack>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: { xs: 1, md: 3 } }}>{/* <SearchSection /> */}</Box>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {/* <NotificationSection /> */}
        <ProfileSection />
      </Stack>
    </Box>
  );
}
