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

    // DEBUG: Log all slices to console
    console.log('=== ALL SLICES FOR:', title, '===')
    if (work.data.body && Array.isArray(work.data.body)) {
      work.data.body.forEach((slice, index) => {
        console.log(`Slice ${index}:`, {
          slice_type: slice.slice_type,
          primary: slice.primary,
          hasEmbedUrl: !!slice.primary?.embed_url,
          hasHtml: !!slice.primary?.html,
          embedUrl: slice.primary?.embed_url,
          htmlPreview: slice.primary?.html ? slice.primary.html.substring(0, 100) : null
        })
      })
    }

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

          {/* DEBUG OUTPUT - Shows what slices we have */}
          <div style={{ padding: '30px', background: '#f0f0f0', margin: '20px' }}>
            <h3>DEBUG: Slices Found</h3>
            {work.data.body && Array.isArray(work.data.body) && (
              <ul>
                {work.data.body.map((slice, index) => (
                  <li key={index}>
                    <strong>Slice {index}:</strong> {slice.slice_type}
                    {slice.slice_type === 'video' && (
                      <div style={{ marginLeft: '20px', fontSize: '12px' }}>
                        <div>Has embed_url: {slice.primary?.embed_url ? 'YES' : 'NO'}</div>
                        <div>Has html: {slice.primary?.html ? 'YES' : 'NO'}</div>
                        {slice.primary?.embed_url && <div>URL: {slice.primary.embed_url}</div>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Render all body slices */}
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
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            objectFit: 'contain',
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
                
                // VIDEO SLICES - Try all possible field names
                if (slice.slice_type === 'video') {
                  const caption = slice.primary?.caption && Array.isArray(slice.primary.caption) && slice.primary.caption.length > 0
                    ? asText(slice.primary.caption)
                    : ''
                  
                  // Try different possible field names
                  const embedHtml = slice.primary?.html || slice.primary?.embed_html || slice.primary?.video_embed
                  
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
                  } else {
                    // Show placeholder if no embed HTML found
                    return (
                      <div key={`video-${index}`} style={{ padding: '30px', background: '#ffcccc', margin: '20px' }}>
                        <p><strong>Video slice found but no embed HTML</strong></p>
                        <p>embed_url: {slice.primary?.embed_url || 'none'}</p>
                        <p>Available fields: {Object.keys(slice.primary || {}).join(', ')}</p>
                      </div>
                    )
                  }
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
