import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AuthWrapper1 from './AuthWrapper1';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthLogin from '../auth-forms/AuthLogin';

import DashboardBg from '../../../assets/images/auth/a.png';

export default function Login() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: '#D4AF37',
            filter: 'blur(120px)',
            top: -100,
            left: -100
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            filter: 'blur(100px)',
            bottom: -100,
            right: -100
          }}
        />
        <Box
          sx={{
            width: '100%',
            maxWidth: 1100,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}
        >
          <Stack
            direction={downMD ? 'column' : 'row'}
            sx={{
              minHeight: downMD ? 'auto' : '650px'
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: { xs: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: ` url(${DashboardBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff'
              }}
            >
              <Box sx={{ zIndex: 2 }}>
                <Link to="#">
                  <Logo />
                </Link>
              </Box>
              <Box sx={{ zIndex: 2, my: downMD ? 6 : 0 }}>
                <Typography
                  variant={downMD ? 'h5' : 'h3'}
                  sx={{
                    fontWeight: 700,
                    color: '#ffffff',
                    mb: 1.5,
                    lineHeight: 1.3
                  }}
                >
                  Deal making just got easier
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    maxWidth: 420,
                    lineHeight: 1.7,
                    fontSize: '15px'
                  }}
                >
                  Manage your dashboard, analytics and business operations with a modern and powerful admin experience.
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  opacity: 0.5,
                  zIndex: 2
                }}
              />
            </Box>
            <Box
              sx={{
                width: downMD ? '100%' : '420px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 3, md: 5 },
                py: { xs: 5, md: 8 }
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 340 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#D4AF37',
                    mb: 1
                  }}
                >
                  Login
                </Typography>

                <Typography
                  sx={{
                    color: '#90a4ae',
                    mb: 4,
                    fontSize: '14px'
                  }}
                >
                  Welcome back! Please enter your details.
                </Typography>

                <AuthLogin />
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            width: '100%'
          }}
        >
          <AuthFooter />
        </Box>
      </Box>
    </AuthWrapper1>
  );
}
