import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'cjk4py5y',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  deployment: {
    appId: 'abb6j9jehpn7sa93777zk7d7',
  },
})