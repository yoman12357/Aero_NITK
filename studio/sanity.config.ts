import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'aeronitk',
  title: 'Aero NITK Content Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'zjq9gqub',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})