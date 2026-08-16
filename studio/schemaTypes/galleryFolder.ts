import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'galleryFolder',
    title: 'Gallery Folder',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Folder Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'images',
            title: 'Folder Images',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'galleryImageItem',
                    title: 'Image Item',
                    fields: [
                        defineField({
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                },
            ],
        }),
    ],
});