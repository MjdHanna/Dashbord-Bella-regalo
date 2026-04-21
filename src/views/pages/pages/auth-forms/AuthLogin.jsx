import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// MUI
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// project
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';

// icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// redux
import { useLoginMutation } from 'store/api/baseApi';
import { setCredentials } from 'store/slices/authSlice';

export default function AuthLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(formData).unwrap();

      dispatch(
        setCredentials({
          token: res.token,
          user: res.user
        })
      );

      navigate('/dashboard/default'); // 🔥 بعد تسجيل الدخول
    } catch (err) {
      console.error(err);
      alert('Login Failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CustomFormControl fullWidth>
        <InputLabel>Email</InputLabel>
        <OutlinedInput type="email" name="email" value={formData.email} onChange={handleChange} />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
            </InputAdornment>
          }
        />
      </CustomFormControl>

      <Grid container justifyContent="space-between">
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
          label="Keep me logged in"
        />
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button fullWidth type="submit" variant="contained">
            Sign In
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
