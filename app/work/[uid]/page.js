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
    
let title = 'Untitled'
if (work.data.title && work.data.title.length > 0) {
  title = asText(work.data.title)
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

          {work.data.image && work.data.image.length > 0 && (
            <div className="project-images">
              {work.data.image.map((item, index) => (
                <div key={index}>
                  {item.image && item.image.url && (
                    <>
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
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {work.data.video && work.data.video.length > 0 && (
            <div className="project-images">
              {work.data.video.map((item, index) => (
                <div key={index}>
                  {item.embed_url && item.html && (
                    <>
                      <div className="project-image video-container">
                        <div 
                          className="video-embed"
                          dangerouslySetInnerHTML={{ __html: item.html }}
                        />
                      </div>
                      {item.caption && item.caption.length > 0 && (
                        <div className="image-caption">
                          {asText(item.caption)}
                        </div>
                      )}
                    </>
                  )}
                </div>
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
