'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Lightbox({ images }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  const navigate = (direction) => {
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = images.length - 1
    if (newIndex >= images.length) newIndex = 0
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        if (e.key === 'Escape') closeLightbox()
        else if (e.key === 'ArrowLeft') navigate(-1)
        else if (e.key === 'ArrowRight') navigate(1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Gallery Items */}
      <div className="project-images">
        {images.map((image, index) => (
          <div key={index}>
            <div className="project-image">
              <div 
                className="gallery-item" 
                onClick={() => openLightbox(index)}
                style={{ cursor: 'pointer' }}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  width={image.dimensions.width}
                  height={image.dimensions.height}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '90vh',
                    objectFit: 'contain'
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

      {/* Lightbox Overlay */}
      {isOpen && (
        <div className="lightbox active">
          <a 
            href="#" 
            className="lightbox-close" 
            onClick={(e) => { e.preventDefault(); closeLightbox(); }}
          >
            ✕
          </a>
          <a 
            href="#" 
            className="lightbox-nav lightbox-prev" 
            onClick={(e) => { e.preventDefault(); navigate(-1); }}
          >
            ←
          </a>
          <a 
            href="#" 
            className="lightbox-nav lightbox-next" 
            onClick={(e) => { e.preventDefault(); navigate(1); }}
          >
            →
          </a>
          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="lightbox-content">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
              width={images[currentIndex].dimensions.width}
              height={images[currentIndex].dimensions.height}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
