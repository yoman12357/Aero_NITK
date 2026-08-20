import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Post',
      type: 'string',
      description: 'e.g., Aerodynamics Lead, Web Associate, Convener',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamType',
      title: 'Team Type',
      type: 'string',
      description: 'Determines which section of the page they appear in.',
      options: {
        list: [
          { title: 'Team Head', value: 'Head' },
          { title: 'Student Mentor', value: 'Mentor' },
          { title: 'Subsystem Member', value: 'Member' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subsystem',
      title: 'Subsystem',
      type: 'string',
      options: {
        list: [
          'Aerodynamics',
          'Structures',
          'Avionics',
          'Marketing',
          'Media',
          'Web Team',
          'Other',
        ],
      },
      // Hides the subsystem dropdown if the person is a Head or Mentor
      hidden: ({ document }) => document?.teamType !== 'Member',
    }),
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
});