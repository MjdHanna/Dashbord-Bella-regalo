import { IconShoppingCart } from '@tabler/icons-react';

const icons = { IconShoppingCart };

const orders = {
  id: 'orders-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'orders',
      title: 'Orders',
      type: 'item',
      url: '/orders',
      icon: icons.IconShoppingCart
    }
  ]
};

export default orders;
