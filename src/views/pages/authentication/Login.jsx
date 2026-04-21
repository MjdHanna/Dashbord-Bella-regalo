import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthLogin from '../auth-forms/AuthLogin';

export default function Login() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Box
        sx={{
          minHeight: '100vh',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* subtle gradient shapes */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            background: 'rgba(99,102,241,0.15)',
            filter: 'blur(120px)',
            top: -100,
            left: -100,
            borderRadius: '50%'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            background: 'rgba(236,72,153,0.15)',
            filter: 'blur(120px)',
            bottom: -80,
            right: -80,
            borderRadius: '50%'
          }}
        />

        <Stack sx={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Box sx={{ width: '100%', maxWidth: 420, px: 2 }}>
            <AuthCardWrapper
              sx={{
                background: '#fff',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9'
              }}
            >
              <Stack spacing={3} alignItems="center">
                <Link to="#">
                  <Logo />
                </Link>

                <Stack spacing={1} alignItems="center">
                  <Typography variant={downMD ? 'h4' : 'h3'} sx={{ fontWeight: 700, color: 'rgb(255,224,2)' }}>
                    Welcome Back 👋
                  </Typography>
                  {/* <Typography sx={{ color: 'text.secondary' }}>Login to your account</Typography> */}
                  {/* delete from login pages */}
                </Stack>

                <Box sx={{ width: '100%' }}>
                  <AuthLogin />
                </Box>

                <Divider sx={{ width: '100%' }} />

                {/* <Typography
                  component={Link}
                  to="#"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot password?
                </Typography> */}
              </Stack>
            </AuthCardWrapper>
          </Box>
        </Stack>

        <Box sx={{ px: 3, py: 2 }}>
          <AuthFooter />
        </Box>
      </Box>
    </AuthWrapper1>
  );
}
