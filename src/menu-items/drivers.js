import { IconTruck } from '@tabler/icons-react';

const icons = { IconTruck };

const drivers = {
  id: 'drivers-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'drivers',
      title: 'Drivers',
      type: 'item',
      url: '/drivers',
      icon: icons.IconTruck
    }
  ]
};

export default drivers;
