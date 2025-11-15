import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asText, asHTML } from '@prismicio/client'
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
    
    const dimensions = work.data.dimensions && work.data.dimensions.length > 0 
      ? asText(work.data.dimensions) 
      : null

    const materials = work.data.materials && work.data.materials.length > 0
      ? asText(work.data.materials)
      : null

    // Combine images and videos into a single gallery array
    const galleryItems = []
    
    // Add images
    if (work.data.gallery && work.data.gallery.length > 0) {
      work.data.gallery.forEach((item, index) => {
        if (item.image && item.image.url) {
          galleryItems.push({
            type: 'image',
            data: item,
            index: index
          })
        }
      })
    }

    // Add videos (if the field exists)
    if (work.data.video_embed && work.data.video_embed.length > 0) {
      work.data.video_embed.forEach((item, index) => {
        if (item.embed_url) {
          galleryItems.push({
            type: 'video',
            data: item,
            index: index
          })
        }
      })
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
            
            <h1 className="project-title">
              {work.data.title ? asText(work.data.title) : 'Untitled'}
            </h1>
            
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

          {/* Gallery with Images AND Videos */}
          {galleryItems.length > 0 && (
            <div className="project-images">
              {galleryItems.map((item, index) => (
                <div key={index}>
                  {item.type === 'image' ? (
                    // IMAGE DISPLAY
                    <>
                      <div className="project-image">
                        <PrismicNextImage
                          field={item.data.image}
                          className="gallery-item"
                          data-index={index}
                        />
                      </div>
                      {item.data.caption && item.data.caption.length > 0 && (
                        <div className="image-caption">
                          {asText(item.data.caption)}
                        </div>
                      )}
                    </>
                  ) : (
                    // VIDEO DISPLAY
                    <>
                      <div className="project-image video-container">
                        <div 
                          className="video-embed"
                          dangerouslySetInnerHTML={{ 
                            __html: item.data.html 
                          }}
                        />
                      </div>
                      {item.data.caption && item.data.caption.length > 0 && (
                        <div className="image-caption">
                          {asText(item.data.caption)}
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
    notFound()
  }
}
