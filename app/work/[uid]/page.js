import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asText } from '@prismicio/client'
import { PrismicRichText } from '@prismicio/react'
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

    // Extract images from body slices
    const galleryImages = []
    if (work.data.body && Array.isArray(work.data.body)) {
      work.data.body.forEach(slice => {
        if (slice.slice_type === 'image' && slice.primary?.image) {
          galleryImages.push(slice.primary.image)
        }
      })
    }

    // Also check for a gallery field (in case it exists)
    if (work.data.gallery && Array.isArray(work.data.gallery)) {
      galleryImages.push(...work.data.gallery)
    }

    // Extract title from Rich Text field
    const title = work.data.project_title 
      ? asText(work.data.project_title)
      : 'Untitled'

    // Get the year from project_date
    const year = work.data.project_date 
      ? new Date(work.data.project_date).getFullYear()
      : ''

    return (
      <>
        <Navigation shows={allWorks} works={allWorks} />
        <CursorTracker />
        
        <main className="main-content">
          <div className="project-view">
            <Link href="/" className="back-link">
              ←
            </Link>
            
            <h1 className="project-title">{title}</h1>
            
            <div className="project-info">
              {year && <>{year}</>}
              <br /><br />
              {work.data.intro_text && (
                <PrismicRichText field={work.data.intro_text} />
              )}
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
