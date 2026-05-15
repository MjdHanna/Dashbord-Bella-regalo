import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');
const abilitiesFromStorage = localStorage.getItem('abilities');

let parsedUser = null;
let parsedAbilities = [];

try {
  if (userFromStorage && userFromStorage !== 'undefined') {
    parsedUser = JSON.parse(userFromStorage);
  }

  if (abilitiesFromStorage && abilitiesFromStorage !== 'undefined') {
    parsedAbilities = JSON.parse(abilitiesFromStorage);
  }
} catch (e) {
  parsedUser = null;
  parsedAbilities = [];
}

const initialState = {
  token: tokenFromStorage && tokenFromStorage !== 'undefined' ? tokenFromStorage : null,
  user: parsedUser,
  abilities: parsedAbilities
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { token, user, abilities } = action.payload;

      state.token = token;
      state.user = user;
      state.abilities = abilities || [];

      localStorage.setItem('token', token);

      localStorage.setItem('user', JSON.stringify(user));

      localStorage.setItem('abilities', JSON.stringify(abilities || []));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.abilities = [];

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('abilities');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectAbilities = (state) => state.auth.abilities;

export default authSlice.reducer;
