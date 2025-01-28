import type { Metadata } from 'next'
import { metadata as siteMetadata } from '@/config/metadata'
import { AboutPage } from '@/components/pages/about'

export const metadata: Metadata = {
  title: siteMetadata.about.title,
  description: siteMetadata.about.description,
  keywords: siteMetadata.about.keywords,
  openGraph: {
    title: siteMetadata.about.title,
    description: siteMetadata.about.description,
    url: 'https://monalouisateaches.com/about',
    siteName: 'Monalouisa Teaches',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Monalouisa Teaches',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.about.title,
    description: siteMetadata.about.description,
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default AboutPage
