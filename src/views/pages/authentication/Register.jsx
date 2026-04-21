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
import AuthRegister from '../auth-forms/AuthRegister';

export default function Register() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Box
        sx={{
          minHeight: '100vh',
          // background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Box sx={{ m: { xs: 2, sm: 3 }, width: '100%', maxWidth: 450 }}>
            <AuthCardWrapper
              sx={{
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
              }}
            >
              <Stack spacing={3} alignItems="center">
                {/* Logo */}
                <Link to="#">
                  <Logo />
                </Link>

                {/* Title */}
                <Stack spacing={1} alignItems="center">
                  <Typography variant={downMD ? 'h4' : 'h3'} sx={{ fontWeight: 700, color: 'black' }}>
                    Create Account
                  </Typography>
                  <Typography sx={{ color: 'black' }}>Start your journey with us 🚀</Typography>
                </Stack>

                {/* Form */}
                <AuthRegister />

                <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Login */}
                <Typography
                  component={Link}
                  to="/pages/login"
                  sx={{
                    color: '#a5b4fc',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Already have an account? Login
                </Typography>
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
