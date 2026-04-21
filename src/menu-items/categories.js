import { IconCategory } from '@tabler/icons-react';

const icons = { IconCategory };

const categories = {
  id: 'categories-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: icons.IconCategory
    }
  ]
};

export default categories;
