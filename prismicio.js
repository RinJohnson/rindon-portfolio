import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'

export const repositoryName = 'rindon'

export const client = prismic.createClient(repositoryName, {
  routes: [
    {
      type: 'work_item',
      path: '/work/:uid',
    },
  ],
})

enableAutoPreviews({
  client,
})
