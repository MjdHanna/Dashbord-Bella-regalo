import { useState } from 'react';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/features/auth/authSlice';
import { useLogoutMutation } from '../../../../redux/features/services/baseApi';

export default function SettingsMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (e) {}

    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <SettingsIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <ListItemText primary="Account Settings" />
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
