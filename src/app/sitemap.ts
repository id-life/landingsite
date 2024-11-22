import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.id.life/',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
  ]
}