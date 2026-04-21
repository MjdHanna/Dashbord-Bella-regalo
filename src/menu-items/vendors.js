import { IconBuildingStore } from '@tabler/icons-react';

const icons = { IconBuildingStore };

const vendors = {
  id: 'vendors-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'vendors',
      title: 'Vendors',
      type: 'item',
      url: '/vendors',
      icon: icons.IconBuildingStore
    }
  ]
};

export default vendors;
