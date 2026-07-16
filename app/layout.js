import './globals.css'

export const metadata = {
  metadataBase: new URL('https://www.rinjohnson.com'),
  title: 'Rindon Johnson',
  description:
    'Rindon Johnson is an artist and poet. Solo exhibitions at Chisenhale Gallery, SculptureCenter, the Rockbund Art Museum, Albertinum, and Bergen Kunsthall.',
  alternates: {
    canonical: 'https://www.rinjohnson.com',
  },
  openGraph: {
    title: 'Rindon Johnson',
    description:
      'Rindon Johnson is an artist and poet. Solo exhibitions at Chisenhale Gallery, SculptureCenter, the Rockbund Art Museum, Albertinum, and Bergen Kunsthall.',
    url: 'https://www.rinjohnson.com',
    siteName: 'Rindon Johnson',
    type: 'website',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rindon Johnson',
  alternateName: 'Rin Johnson',
  description: 'Artist and poet',
  birthDate: '1990',
  birthPlace: {
    '@type': 'Place',
    name: 'San Francisco, California',
  },
  url: 'https://www.rinjohnson.com',
  sameAs: [
    'https://en.wikipedia.org/wiki/Rindon_Johnson',
    'https://www.wikidata.org/wiki/Q45740656',
    'https://www.maxgoelitz.com/en/artists/58-rindon-johnson/',
    'https://cibrian.eu/artists/rindon-johnson/',
    'https://www.artsy.net/artist/rindon-johnson',
    'https://www.instagram.com/rindonjohnsonstudio/',
    'https://vimeo.com/user11523618',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
