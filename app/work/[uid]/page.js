import Link from 'next/link'
import { notFound } from 'next/navigation'
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

// Safe text extractor
function safeGetText(field) {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (Array.isArray(field) && field.length > 0 && field[0]?.text) {
    return field[0].text
  }
  return ''
}

// Check if rich text field has content
function hasRichTextContent(field) {
  if (!field) return false
  if (Array.isArray(field) && field.length > 0) {
    return field.some(block => block?.text && block.text.trim() !== '')
  }
  return false
}

export default async function WorkPage({ params }) {
  const allWorks = await client.getAllByType('work_item')
  
  try {
    const work = await client.getByUID('work_item', params.uid)
    
    // Safely get title
    const title = safeGetText(work.data?.project_title) || 'Untitled'
    
    // Safely get other text fields
    const dimensions = safeGetText(work.data?.dimensions)
    const materials = safeGetText(work.data?.materials)
    const location = safeGetText(work.data?.location)
    
    // Safely get year
    let year = ''
    if (work.data?.project_date) {
      try {
        year = new Date(work.data.project_date).getFullYear().toString()
      } catch (e) {
        console.error('Error parsing date:', e)
      }
    }

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
              {year && (
                <>
                  {year}
                  <br />
                </>
              )}
              
              {location && (
                <>
                  {location}
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
              
              {hasRichTextContent(work.data?.text) && (
                <>
                  <br />
                  <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    <PrismicRichText field={work.data.text} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Handle Body slices for images, videos, and text */}
          {work.data?.body && Array.isArray(work.data.body) && work.data.body.length > 0 && (
            <div className="project-images">
              {work.data.body.map((slice, index) => {
                // Handle Image slices
                if (slice.slice_type === 'image' && slice.primary?.image?.url) {
                  const caption = safeGetText(slice.primary?.caption)
                  
                  return (
                    <div key={`image-${index}`}>
                      <div className="project-image">
                        <PrismicNextImage
                          field={slice.primary.image}
                          className="gallery-item"
                          data-index={index}
                        />
                      </div>
                      {caption && (
                        <div className="image-caption">
                          {caption}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Handle Video slices
                if (slice.slice_type === 'video' && slice.primary?.embed_url && slice.primary?.html) {
                  const caption = safeGetText(slice.primary?.caption)
                  
                  return (
                    <div key={`video-${index}`}>
                      <div className="project-image video-container">
                        <div 
                          className="video-embed"
                          dangerouslySetInnerHTML={{ __html: slice.primary.html }}
                        />
                      </div>
                      {caption && (
                        <div className="image-caption">
                          {caption}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // Handle Text slices
                if (slice.slice_type === 'text' && hasRichTextContent(slice.primary?.text)) {
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
