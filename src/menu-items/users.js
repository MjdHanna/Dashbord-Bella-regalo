import { IconUser } from '@tabler/icons-react';

const icons = { IconUser };

const users = {
  id: 'users-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.IconUser
    }
  ]
};

export default users;
