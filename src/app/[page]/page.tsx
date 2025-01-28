import type { Metadata } from 'next'
import { metadata as siteMetadata } from '@/config/metadata'

interface PageProps {
  params: {
    page: keyof typeof siteMetadata
  }
}

export const generateMetadata = ({ params }: PageProps): Metadata => {
  const page = params.page

  return {
    title: siteMetadata[page].title,
    description: siteMetadata[page].description,
    keywords: siteMetadata[page].keywords,
    openGraph: {
      title: siteMetadata[page].title,
      description: siteMetadata[page].description,
      url: `https://monalouisateaches.com/${page}`,
      siteName: 'Monalouisa Teaches',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Monlouisa Teaches - ${page}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteMetadata[page].title,
      description: siteMetadata[page].description,
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
}
