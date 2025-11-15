'use client'

import Image from 'next/image'

export default function Lightbox({ images }) {
  if (!images || images.length === 0) return null

  return (
    <div className="project-images">
      {images.map((image, index) => (
        <div key={index}>
          <div className="project-image">
            <div>
              <Image
                src={image.url}
                alt={image.alt || `Image ${index + 1}`}
                width={image.dimensions.width}
                height={image.dimensions.height}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>
          {image.caption && (
            <div className="image-caption">{image.caption}</div>
          )}
        </div>
      ))}
    </div>
  )
}
