import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'alumni',
  title: 'Alumni Batch',
  type: 'document',
  fields: [
    defineField({
      name: 'batchyear',
      title: 'Batch Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Batch Name',
      type: 'string',
      description: 'e.g. "Batch 2024" — shown as the folder title',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'coverimage',
      title: 'Batch Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'images',
      title: 'Alumni Members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'alumniMember',
          title: 'Alumni Member',
          fields: [
            defineField({
              name: 'name',
              title: 'Full Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'role', title: 'Role / Subsystem', type: 'string' }),
            defineField({ name: 'company', title: 'Company', type: 'string' }),
            defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
            defineField({
              name: 'image',
              title: 'Profile Photo',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'batchyear', media: 'coverimage' },
  },
})