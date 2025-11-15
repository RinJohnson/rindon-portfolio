import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '../../../prismicio'
import Navigation from '../../../components/Navigation'
import CursorTracker from '../../../components/CursorTracker'
import Lightbox from '../../../components/Lightbox'

export async function generateStaticParams() {
  const works = await client.getAllByType('work_item')
  
  return works.map((work) => ({
    uid: work.uid,
  }))
}

export default async function WorkPage({ params }) {
  const { uid } = params
  
  try {
    const work = await client.getByUID('work_item', uid)
    const allWorks = await client.getAllByType('work_item')

    // Extract gallery images
    const galleryImages = work.data.gallery || []

    return (
      <>
        <Navigation shows={allWorks} works={allWorks} />
        <CursorTracker />
        
        <main className="main-content">
          <div className="project-view">
            <Link href="/" className="back-link">
              ←
            </Link>
            
            <h1 className="project-title">{work.data.title}</h1>
            
            <div className="project-info">
              {work.data.venue && <>{work.data.venue}</>}
              {work.data.location && <>, {work.data.location}</>}
              {work.data.year && <>, {work.data.year}</>}
              <br /><br />
              {work.data.description && <>{work.data.description}</>}
            </div>
          </div>

          {galleryImages.length > 0 && (
            <Lightbox images={galleryImages} />
          )}

          {work.data.video_embed && work.data.video_embed.html && (
            <div className="project-video" style={{ 
              padding: '30px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <div dangerouslySetInnerHTML={{ __html: work.data.video_embed.html }} />
            </div>
          )}
        </main>
      </>
    )
  } catch (error) {
    notFound()
  }
}
