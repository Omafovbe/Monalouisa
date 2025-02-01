interface MetadataConfig {
  [key: string]: {
    title: string
    description: string
    keywords: string[]
  }
}

export const metadata: MetadataConfig = {
  about: {
    title: 'About Us | Monalouisa Teaches',
    description:
      'Learn about Monalouisa Teaches - where language learning is more than just mastering words. Discover our mission, approach, and commitment to empowering children aged 4-18 with expert-designed language courses.',
    keywords: [
      'language learning',
      'children education',
      'online teaching',
      'Spanish courses',
      'French courses',
      'Chinese courses',
      'English courses',
      'language school',
      'online tutoring',
      'kids language learning',
    ],
  },
  // Add other pages metadata here
  teach: {
    title: 'Teach with Us | Monalouisa Teaches',
    description:
      'Join our team of passionate language teachers. Apply now to teach languages to students aged 4-18 in an engaging online environment.',
    keywords: [
      'teaching jobs',
      'online teaching',
      'language teacher',
      'ESL teaching',
      'remote teaching',
      'teaching opportunity',
      'language tutor',
    ],
  },
}
