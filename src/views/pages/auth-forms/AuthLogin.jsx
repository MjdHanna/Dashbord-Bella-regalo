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

  // ✅ redirect فوري بدون delay
  useEffect(() => {
    if (token) {
      navigate('/dashboard/default', { replace: true });
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      try {
        const res = await login(values).unwrap();

        dispatch(
          setCredentials({
            token: res.data.accessToken, // 🔥 هذا هو الصح
            user: {
              id: res.data.userId,
              name: res.data.userName,
              role: res.data.userAccountType
            }
          })
        );
      } catch (err) {
        console.error(err);
        alert('Login failed');
      }
    }
  });

  const inputStyle = {
    borderRadius: 3,
    background: '#f9fafb',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#6366f1' },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.15)'
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        {/* Email */}
        <Box>
          <InputLabel>Email</InputLabel>
          <OutlinedInput
            fullWidth
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={inputStyle}
          />
          <Typography color="error" variant="caption">
            {formik.touched.email && formik.errors.email}
          </Typography>
        </Box>

        {/* Password */}
        <Box>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            fullWidth
            type={showPassword ? 'text' : 'password'}
            name="password"
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
          <Typography color="error" variant="caption">
            {formik.touched.password && formik.errors.password}
          </Typography>
        </Box>

        {/* Button */}
        <Button
          fullWidth
          type="submit"
          disabled={formik.isSubmitting}
          sx={{
            mt: 1,
            borderRadius: 3,
            py: 1.3,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(99,102,241,0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 15px 35px rgba(99,102,241,0.4)'
            }
          }}
        >
          {formik.isSubmitting ? 'Signing in...' : 'Login'}
        </Button>
      </Stack>
    </form>
  );
}
