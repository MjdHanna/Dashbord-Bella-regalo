import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');

let parsedUser = null;

try {
  if (userFromStorage && userFromStorage !== 'undefined') {
    parsedUser = JSON.parse(userFromStorage);
  }
} catch (e) {
  parsedUser = null;
}

const initialState = {
  token: tokenFromStorage && tokenFromStorage !== 'undefined' ? tokenFromStorage : null,
  user: parsedUser
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem('token', action.payload.token);

      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem('user');
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
