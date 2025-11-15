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
    
    // DEBUG: Let's see what fields exist
    console.log('Work data fields:', Object.keys(work.data))
    console.log('Full work data:', work.data)
    
    // Try multiple possible title fields
    let title = 'Untitled'
    if (work.data.title && work.data.title.length > 0) {
      title = asText(work.data.title)
    } else if (work.data.intro_text && work.data.intro_text.length > 0) {
      title = asText(work.data.intro_text)
    } else if (work.data.name && work.data.name.length > 0) {
      title = asText(work.data.name)
    } else if (work.data.work_title && work.data.work_title.length > 0) {
      title = asText(work.data.work_title)
    }
    
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
            
            {/* DEBUG INFO - Remove this later */}
            <div style={{ background: '#ffe0e0', padding: '10px', marginBottom: '20px', fontSize: '12px' }}>
              <strong>Debug Info (remove later):</strong><br />
              Available fields: {Object.keys(work.data).join(', ')}
            </div>
            
            <div className="project-info">
              {work.data.date && (
                <>
                  {new Date(work.data.date).getFullYear()}
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
              
              {work.data.description && work.data.description.length > 0 && (
                <>
                  <br />
                  <PrismicRichText field={work.data.description} />
                </>
              )}
            </div>
          </div>

          {/* Images */}
          {work.data.gallery && work.data.gallery.length > 0 && (
            <div className="project-images">
              {work.data.gallery.map((item, index) => (
                item.image && item.image.url && (
                  <div key={index}>
                    <div className="project-image">
                      <PrismicNextImage
                        field={item.image}
                        className="gallery-item"
                        data-index={index}
                      />
                    </div>
                    {item.caption && item.caption.length > 0 && (
                      <div className="image-caption">
                        {asText(item.caption)}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Videos */}
          {work.data.video_embed && work.data.video_embed.length > 0 && (
            <div className="project-images">
              {work.data.video_embed.map((item, index) => (
                item.embed_url && (
                  <div key={`video-${index}`}>
                    <div className="project-image video-container">
                      <div 
                        className="video-embed"
                        dangerouslySetInnerHTML={{ 
                          __html: item.html 
                        }}
                      />
                    </div>
                  </div>
                )
              ))}
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
