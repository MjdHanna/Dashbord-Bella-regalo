import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AuthWrapper1 from './AuthWrapper1';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthLogin from '../auth-forms/AuthLogin';

// svg
import DashboardSvg from '../../../assets/images/auth/Dashboard.gif.mp4';

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
        {/* background blur */}
        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: '#EAEFEF',
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

        {/* main card */}
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
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 3, md: 8 },
                py: { xs: 6, md: 8 },
                position: 'relative',
                background: 'linear-gradient(180deg, #ffffff 0%, #f7fbfb 100%)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 30,
                  left: 30
                }}
              >
                <Link to="#">
                  <Logo />
                </Link>
              </Box>

              <Box
                component="video"
                src={DashboardSvg}
                autoPlay
                loop
                muted
                playsInline
                sx={{
                  width: '100%',
                  maxWidth: 420,
                  mb: 4,
                  animation: 'float 4s ease-in-out infinite',
                  background: 'transparent',
                  objectFit: 'contain'
                }}
              />

              <Typography
                variant={downMD ? 'h5' : 'h4'}
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#263238',
                  mb: 1
                }}
              >
                Deal making just got easier
              </Typography>

              <Typography
                sx={{
                  textAlign: 'center',
                  color: '#607d8b',
                  maxWidth: 400,
                  lineHeight: 1.7,
                  fontSize: '15px'
                }}
              >
                Manage your dashboard, analytics and business operations with a modern and powerful admin experience.
              </Typography>
            </Box>

            {/* RIGHT SIDE */}
            <Box
              sx={{
                width: downMD ? '100%' : '420px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 3, md: 5 },
                py: { xs: 5, md: 8 },
                borderLeft: downMD ? 'none' : '1px solid #eef2f7'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 340 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#2f5f62',
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

        {/* footer */}
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

        {/* animation */}
        <style>
          {`
            @keyframes float {
              0% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
              100% {
                transform: translateY(0px);
              }
            }
          `}
        </style>
      </Box>
    </AuthWrapper1>
  );
}
