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
    
    // Get title from intro_text field (based on your Prismic structure)
    let title = 'Untitled'
    if (work.data.intro_text && work.data.intro_text.length > 0) {
      title = asText(work.data.intro_text)
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

          {/* Images */}
          {work.data.image && work.data.image.length > 0 && (
            <div className="project-images">
              {work.data.image.map((item, index) => (
                <div key={index}>
                  {item.image && item.image.url && (
                    <>
                      <div className="pr
