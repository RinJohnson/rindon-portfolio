import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { asText } from '@prismicio/client'
import { PrismicRichText } from '@prismicio/react'
import { client } from '../../../prismicio'
import Navigation from '../../../components/Navigation'
import CursorTracker from '../../../components/CursorTracker'
import Lightbox from '../../../components/Lightbox'

export async function generateStaticParams() {
  const works = await client.getAllByType('work_item')
  return works.map((work) => ({ uid: work.uid }))
}

export default async function WorkPage({ params }) {
  const { uid } = params
  
  try {
    const work = await client.getByUID('work_item', uid)
    const allWorks = await client.getAllByType('work_item')

    // Extract images for the Lightbox
    const galleryImages = []
    if (work.data.body && Array.isArray(work.data.body)) {
      work.data.body.forEach(slice => {
        if (slice.slice_type === 'image' && slice.primary?.image?.url) {
          galleryImages.push(slice.primary.image)
        }
      })
    }

    const title = work.data.project_title 
      ? asText(work.data.project_title)
      : 'Untitled'

    const year = work.data.project_date 
      ? new Date(work.data.project_date).getFullYear()
      : ''

    // Pre-filter valid slices
    const validSlices = work.data.body && Array.isArray(work.data.body)
      ? work.data.body.filter(slice => {
          if (!slice || !slice.slice_type) return false
          if (slice.slice_type === 'image' && slice.primary?.image?.url) return true
          if (slice.slice_type === 'video' && slice.primary?.embed_url && slice.primary?.html) return true
          if (slice.slice_type === 'text' && slice.primary?.text && Array.isArray(slice.primary.text) && slice.primary.text.length > 0) return true
          return false
        })
      : []

    return (
      <>
        <Navigation shows={allWorks} works={allWorks} />
        <CursorTracker />
        
        <main className="main-content">
          <div className="project-view">
            <Link href="/" className="back-link">←</Link>
            <h1 className="project-title">{title}</h1>
            
            <div className="project-info">
              {year && <>{year}</>}
              <br /><br />
              {work.data.intro_text && Array.isArray(work.data.intro_text) && work.data.intro_text.length > 0 && (
                <PrismicRichText field={work.data.intro_text} />
              )}
            </div>
          </div>

          {/* Render ALL valid body slices in order */}
          {validSlices.length > 0 && (
            <div className="project-images">
              {validSlices.map((slice, index) => {
                // Handle Image slices
                if (slice.slice_type === 'image') {
                  const caption = slice.primary?.caption && Array.isArray(slice.primary.caption) && slice.primary.caption.length > 0
                    ? asText(slice.primary.caption)
                    : ''
                  
                  return (
                    <div key={`image-${slice.id || index}`}>
                      <div className="project-image">
                        <img
                          src={slice.primary.image.url}
                          alt={slice.primary.image.alt || caption || title}
                          className="gallery-item"
                          data-index={index}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                      </div>
                      {caption && (
                        <div className="image-caption">{caption}</div>
                      )}
                    </div>
                  )
                }
                
                // Handle Video slices
                if (slice.slice_type === 'video') {
                  const caption = slice.primary?.caption && Array.isArray(slice.primary.caption) && slice.primary.caption.length > 0
                    ? asText(slice.primary.caption)
                    : ''
                  
                  return (
                    <div key={`video-${slice.id || index}`}>
                      <div className="project-image video-container">
                        <div 
                          className="video-embed"
                          dangerouslySetInnerHTML={{ __html: slice.primary.html }}
                        />
                      </div>
                      {caption && (
                        <div className="image-caption">{caption}</div>
                      )}
                    </div>
                  )
                }
                
                // Handle Text slices
                if (slice.slice_type === 'text') {
                  return (
                    <div key={`text-${slice.id || index}`} style={{ 
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

          {/* Lightbox for images only */}
          {galleryImages.length > 0 && <Lightbox images={galleryImages} />}
        </main>
      </>
    )
  } catch (error) {
    console.error('Error loading work:', error)
    notFound()
  }
}
