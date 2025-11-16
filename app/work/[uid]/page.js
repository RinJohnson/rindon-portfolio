import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asText } from '@prismicio/client'
import { PrismicRichText } from '@prismicio/react'
import { client } from '../../../prismicio'
import Navigation from '../../../components/Navigation'
import CursorTracker from '../../../components/CursorTracker'

export async function generateStaticParams() {
  const works = await client.getAllByType('work_item')
  return works.map((work) => ({ uid: work.uid }))
}

export default async function WorkPage({ params }) {
  const { uid } = params
  
  try {
    const work = await client.getByUID('work_item', uid)
    const allWorks = await client.getAllByType('work_item')

    const title = work.data.project_title 
      ? asText(work.data.project_title)
      : 'Untitled'

    const year = work.data.project_date 
      ? new Date(work.data.project_date).getFullYear()
      : ''

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

          {/* Render all body slices in order */}
          {work.data.body && Array.isArray(work.data.body) && work.data.body.length > 0 && (
            <div className="project-content">
              {work.data.body.map((slice, index) => {
                
                // IMAGE SLICES
                if (slice.slice_type === 'image' && slice.primary?.image?.url) {
                  const caption = slice.primary?.caption && Array.isArray(slice.primary.caption) && slice.primary.caption.length > 0
                    ? asText(slice.primary.caption)
                    : ''
                  
                  return (
                    <div key={`image-${index}`}>
                      <div className="project-image">
                        <img
                          src={slice.primary.image.url}
                          alt={slice.primary.image.alt || caption || ''}
                        />
                      </div>
                      {caption && (
                        <div className="image-caption">{caption}</div>
                      )}
                    </div>
                  )
                }
                
                // VIDEO SLICES
                if (slice.slice_type === 'video' && slice.primary?.embed) {
                  const caption = slice.primary?.caption && Array.isArray(slice.primary.caption) && slice.primary.caption.length > 0
                    ? asText(slice.primary.caption)
                    : ''
                  
                  const embedHtml = slice.primary.embed.html
                  
                  if (embedHtml) {
                    return (
                      <div key={`video-${index}`}>
                        <div className="project-video-container">
                          <div 
                            className="video-responsive"
                            dangerouslySetInnerHTML={{ __html: embedHtml }}
                          />
                        </div>
                        {caption && (
                          <div className="image-caption">{caption}</div>
                        )}
                      </div>
                    )
                  }
                  return null
                }
                
                // TEXT SLICES
                if (slice.slice_type === 'text' && slice.primary?.text && Array.isArray(slice.primary.text) && slice.primary.text.length > 0) {
                  return (
                    <div key={`text-${index}`} className="project-text-block">
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
