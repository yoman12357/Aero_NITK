import { CalendarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({ name: 'image', title: 'Card image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'registrationKey',
      title: 'Registration source',
      description: 'Links this event to its Firebase registration count when applicable.',
      type: 'string',
      options: {
        list: [
          { title: 'Skyverse workshop', value: 'workshop' },
          { title: 'Wright Flight', value: 'wrightFlight' },
          { title: 'No live registration source', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'manualParticipantCount',
      title: 'Manual participant count',
      description: 'Shown when no live registration source is selected.',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'maxCapacity',
      title: 'Maximum capacity',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
          { title: 'Opens soon', value: 'soon' },
          { title: 'No badge', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'soon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle === 'none' ? 'No status' : subtitle,
      media,
    }),
  },
})
