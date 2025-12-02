import Link from 'next/link'
import { PrismicRichText } from '@prismicio/react'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function AboutPage() {
  const allWorks = await client.getAllByType('work_item')
  
  // Fetch about content from Prismic
  let about = null
  try {
    about = await client.getSingle('about')
  } catch (error) {
    console.log('About page not set up in Prismic yet')
  }

  return (
    <>
      <Navigation shows={allWorks} works={allWorks} />
      <CursorTracker />
      
      <main className="main-content">
        <div className="project-view">
          <Link href="/" className="back-link">
            ←
          </Link>
          
          <h1 className="project-title">About/CV</h1>
          
          <div className="project-info" style={{ maxWidth: '800px' }}>
            {about ? (
              <>
                {/* Bio Section */}
                {about.data.bio && about.data.bio.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <PrismicRichText field={about.data.bio} />
                  </div>
                )}
                
                {/* CV Section */}
                {about.data.cv_content && about.data.cv_content.length > 0 && (
                  <div>
                    <PrismicRichText field={about.data.cv_content} />
                  </div>
                )}
              </>
            ) : (
              <p>About content coming soon.</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
