export default {
  name: 'event',
  title: 'Events & Registrations',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      initialValue: 'Aero NITK Registration',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open (Ongoing)', value: 'open' },
          { title: 'Opens Soon (Upcoming)', value: 'soon' },
          { title: 'Closed (Past)', value: 'closed' },
          { title: 'Hidden', value: 'none' },
        ],
      },
      initialValue: 'soon',
    },
    {
      name: 'registrationKey',
      title: 'Registration Form Key',
      type: 'string',
      initialValue: 'none',
    },
    {
      name: 'ctaLink',
      title: 'Custom CTA Link (Optional)',
      type: 'string',
      description: 'Custom path or external URL (e.g. /workshop_registration)',
    },
    {
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      initialValue: 'Open Registration Form',
    },
    {
      name: 'manualParticipantCount',
      title: 'Manual Participant Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'maxCapacity',
      title: 'Max Capacity',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
    },
    {
      name: 'image',
      title: 'Event Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};