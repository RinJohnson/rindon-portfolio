'use client'

import { useEffect } from 'react'

export default function CursorTracker() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.body.style.setProperty('--cursor-y', `${e.clientY}px`)
    }

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .gallery-item')) {
        document.body.classList.add('hover-active')
      }
    }

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, .gallery-item')) {
        document.body.classList.remove('hover-active')
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return null
}
