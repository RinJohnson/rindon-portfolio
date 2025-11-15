'use client'

import { useState, useEffect, useRef } from 'react'
import { asText } from '@prismicio/client'
import Link from 'next/link'

export default function Navigation({ shows = [], works = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navRef = useRef(null)

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Group works by tags
  const worksByTag = {}
  works.forEach(work => {
    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach(tag => {
        if (!worksByTag[tag]) {
          worksByTag[tag] = []
        }
        worksByTag[tag].push(work)
      })
    }
  })

  return (
    <nav className="nav-horizontal" ref={navRef}>
      <Link href="/" className="site-title">
        Rindon Johnson
      </Link>
      
      <div className="nav-content">
        <div className={`dropdown ${activeDropdown === 'shows' ? 'active' : ''}`}>
          <button 
            className="dropdown-toggle" 
            onClick={() => toggleDropdown('shows')}
          >
            Shows
          </button>
          <div className="dropdown-menu">
            {shows.map((show) => {
              const title = show.data.project_title 
                ? asText(show.data.project_title)
                : 'Untitled'
              const year = show.data.project_date 
                ? new Date(show.data.project_date).getFullYear()
                : ''
              
              return (
                <Link 
                  key={show.id} 
                  href={`/work/${show.uid}`}
                  onClick={() => setActiveDropdown(null)}
                >
                  {title} {year && `(${year})`}
                </Link>
              )
            })}
          </div>
        </div>

        <div className={`dropdown ${activeDropdown === 'works' ? 'active' : ''}`}>
          <button 
            className="dropdown-toggle" 
            onClick={() => toggleDropdown('works')}
          >
            Works
          </button>
          <div className="dropdown-menu">
            {Object.keys(worksByTag).sort().map((tag) => {
              const displayName = tag.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')
              
              return (
                <Link 
                  key={tag} 
                  href={`/series/${tag}`}
                  onClick={() => setActiveDropdown(null)}
                >
                  {displayName}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="nav-links"><Link href="/contact">Contact</Link></div>
        <div className="nav-links"><Link href="/cv">CV</Link></div>
        <div className="nav-links"><Link href="/news">News</Link></div>
        <div className="nav-links"><Link href="/press">Press</Link></div>
        <div className="nav-links"><Link href="/writing">Writing</Link></div>
      </div>
    </nav>
  )
}
