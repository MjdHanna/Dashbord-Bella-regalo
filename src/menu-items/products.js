import { IconGift } from '@tabler/icons-react';

const icons = { IconGift };

const products = {
  id: 'products-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Products',
      type: 'item',
      url: '/products',
      icon: icons.IconGift
    }
  ]
};

export default products;
