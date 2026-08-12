import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zjq9gqub',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})
