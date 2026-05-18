import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// MUI
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// redux
import { useLoginMutation } from '../../../redux/features/services/baseApi';
import { setCredentials, selectToken } from '../../../redux/features/auth/authSlice';

export default function AuthLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      navigate('/dashboard/default', { replace: true });
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required')
    }),

    onSubmit: async (values) => {
      try {
        const res = await login(values).unwrap();

        dispatch(
          setCredentials({
            token: res.data.accessToken,

            user: {
              id: res.data.userId,
              name: res.data.userName,
              accountType: res.data.userAccountType,
              vendorId: res.data.vendorId
            },

            abilities: res.data.userAbility || []
          })
        );

        navigate('/dashboard/default', {
          replace: true
        });
      } catch (err) {
        console.error(err);

        alert(err?.data?.message || 'Login failed');
      }
    }
  });

  const inputStyle = {
    borderRadius: '14px',
    background: '#f8fbfc',
    transition: '0.3s',

    '& fieldset': {
      borderColor: '#d9e5e7'
    },

    '&:hover fieldset': {
      borderColor: '#4f8b8d'
    },

    '&.Mui-focused fieldset': {
      borderColor: '#4f8b8d',
      boxShadow: '0 0 0 4px rgba(79,139,141,0.12)'
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        {/* Email */}
        <Box>
          <InputLabel
            sx={{
              mb: 1,
              color: '#546e7a',
              fontWeight: 600
            }}
          >
            Email Address
          </InputLabel>

          <OutlinedInput
            fullWidth
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={inputStyle}
          />

          <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
            {formik.touched.email && formik.errors.email}
          </Typography>
        </Box>

        {/* Password */}
        <Box>
          <InputLabel
            sx={{
              mb: 1,
              color: '#546e7a',
              fontWeight: 600
            }}
          >
            Password
          </InputLabel>

          <OutlinedInput
            fullWidth
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={inputStyle}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
              </InputAdornment>
            }
          />

          <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
            {formik.touched.password && formik.errors.password}
          </Typography>
        </Box>

        {/* login button */}
        <Button
          fullWidth
          type="submit"
          disabled={formik.isSubmitting}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '15px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2f5f62 0%, #4f8b8d 100%)',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(47,95,98,0.25)',
            transition: '0.3s',

            '&:hover': {
              transform: 'translateY(-2px)',
              background: 'linear-gradient(135deg, #264d50 0%, #41797b 100%)',
              boxShadow: '0 14px 30px rgba(47,95,98,0.35)'
            }
          }}
        >
          {formik.isSubmitting ? 'Signing in...' : 'Log In'}
        </Button>
      </Stack>
    </form>
  );
}
