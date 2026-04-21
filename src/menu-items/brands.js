import { IconBrandApple } from '@tabler/icons-react';

const icons = { IconBrandApple };

const brands = {
  id: 'brands-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'brands',
      title: 'Brands',
      type: 'item',
      url: '/brands',
      icon: icons.IconBrandApple
    }
  ]
};

export default brands;
