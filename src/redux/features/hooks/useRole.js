import { useSelector } from 'react-redux';
import { selectUser, selectAbilities } from '../redux/features/authSlice';

export default function useRole() {
  const user = useSelector(selectUser);

  const abilities = useSelector(selectAbilities);

  return {
    user,

    abilities,

    isAdmin: user?.accountType === 'admin',

    isVendor: user?.accountType === 'vendor',

    isCustomer: user?.accountType === 'customer'
  };
}
