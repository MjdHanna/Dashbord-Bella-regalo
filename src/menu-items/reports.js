import { IconAlertTriangle } from '@tabler/icons-react';

const icons = { IconAlertTriangle };

const reports = {
  id: 'reports-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: icons.IconAlertTriangle
    }
  ]
};

export default reports;
