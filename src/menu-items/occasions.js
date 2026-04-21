import { IconCalendarEvent } from '@tabler/icons-react';

const icons = { IconCalendarEvent };

const occasions = {
  id: 'occasions-group',
  title: '',
  type: 'group',
  children: [
    {
      id: 'occasions',
      title: 'Occasions',
      type: 'item',
      url: '/occasions',
      icon: icons.IconCalendarEvent
    }
  ]
};

export default occasions;
