import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asText } from '@prismicio/client'
import { PrismicRichText, PrismicNextImage } from '@prismicio/react'
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
  const allWorks = await client.getAllByType('work_item')
  
  try {
    const work = await client.getByUID('work_item', params.uid)
    
    // Use project_title - this is the correct field!
    const title = work.data.project_title && work.data.project_title.length > 0
      ? asText(work.data.project_title)
      : 'Untitled'
    
    const dimensions = work.data.dimensions && work.data.dimensions.length > 0 
      ? asText(work.data.dimensions) 
      : null

    const materials = work.data.materials && work.data.materials.length > 0
      ? asText(work.data.materials)
      : null

    return (
      <>
        <Navigation shows={allWorks} works={allWorks} />
        <CursorTracker />
        <Lightbox />
        
        <main className="main-content">
          <div className="project-view">
            <Link href="/" className="back-link">
              ←
            </Link>
            
            <h1 className="project-title">{title}</h1>
            
            <div className="project-info">
              {work.data.project_date && (
                <>
                  {new Date(work.data.project_date).getFullYear()}
                  <br />
                </>
              )}
              
              {work.data.location && work.data.location.length > 0 && (
                <>
                  {asText(work.data.location)}
                  <br />
                </>
              )}
              
              {dimensions && (
                <>
                  {dimensions}
                  <br />
                </>
              )}
              
              {materials && (
                <>
                  {materials}
                  <br />
                </>
              )}
              
              {work.data.text && work.data.text.length > 0 && (
                <>
                  <br />
                  <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    <PrismicRichText field={work.data.text} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Handle Body slices for images, videos, and text blocks */}
          {work.data.body && work.data.body.length > 0 && (
            <div className="project-images">
              {work.data.body.map((slice, index) => {
                // Handle Image slices
                if (slice.slice_type === 'image' && slice.primary?.image?.url) {
                  return (
                    <div key={`image-${index}`}>
                      <div className="project-image">
                        <PrismicNextImage
                          field={slice.primary.image}
                          className="gallery-item"
                          data-index={index}
                        />
                      </div>
                      {slice.primary.caption && slice.primary.caption.length > 0 && (
                        <div className="image-caption">
                          {asText(slice.primary.caption)}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Handle Video slices
                if (slice.slice_type === 'video' && slice.primary?.embed_url) {
                  return (
                    <div key={`video-${index}`}>
                      <div className="project-image video-container">
                        {slice.primary.html && (
                          <div 
                            className="video-embed"
                            dangerouslySetInnerHTML={{ __html: slice.primary.html }}
                          />
                        )}
                      </div>
                      {slice.primary.caption && slice.primary.caption.length > 0 && (
                        <div className="image-caption">
                          {asText(slice.primary.caption)}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Handle Text slices (the text blocks in Body tab)
                if (slice.slice_type === 'text' && slice.primary?.text) {
                  return (
                    <div key={`text-${index}`} style={{ 
                      maxWidth: '800px', 
                      margin: '40px auto',
                      padding: '0 30px',
                      fontSize: '14px',
                      lineHeight: 1.6
                    }}>
                      <PrismicRichText field={slice.primary.text} />
                    </div>
                  )
                }
                
                return null
              })}
            </div>
          )}
        </main>
      </>
    )
  } catch (error) {
    console.error('Error loading work:', error)
    notFound()
  }
}
