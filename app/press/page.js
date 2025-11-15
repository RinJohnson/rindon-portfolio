import Link from 'next/link'
import { asText } from '@prismicio/client'
import { PrismicRichText } from '@prismicio/react'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function PressPage() {
  const allWorks = await client.getAllByType('work_item')
  
  let pressItems = []
  try {
    pressItems = await client.getAllByType('press', {
      orderings: [
        { field: 'my.press.date', direction: 'desc' }
      ]
    })
  } catch (error) {
    console.error('Press items not found:', error)
  }

  return (
    <>
      <Navigation shows={allWorks} works={allWorks} />
      <CursorTracker />
      
      <main className="main-content">
        <div className="project-view">
          <Link href="/" className="back-link">
            ←
          </Link>
          
          <h1 className="project-title">Press</h1>
          
          <div className="project-info" style={{ maxWidth: '800px' }}>
            {pressItems.length === 0 ? (
              <p style={{ fontSize: '14px' }}>Press coverage coming soon.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {pressItems.map((item) => {
                  const title = item.data.title ? asText(item.data.title) : 'Untitled'
                  const date = item.data.date ? new Date(item.data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''
                  
                  return (
                    <div key={item.id} style={{ 
                      borderBottom: '1px solid #e0e0e0', 
                      paddingBottom: '30px' 
                    }}>
                      {date && (
                        <div style={{ 
                          fontSize: '14px', 
                          marginBottom: '8px', 
                          opacity: 0.7 
                        }}>
                          {date}
                        </div>
                      )}
                      
                      <h2 style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        marginBottom: '12px',
                        lineHeight: 1.6
                      }}>
                        {item.data.link && item.data.link.url ? (
                          <a 
                            href={item.data.link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: 'var(--text-color)', 
                              textDecoration: 'underline' 
                            }}
                          >
                            {title}
                          </a>
                        ) : (
                          title
                        )}
                      </h2>
                      
                      {item.data.text && (
                        <div style={{ 
                          fontSize: '14px !important', 
                          lineHeight: 1.6 
                        }} className="press-text">
                          <PrismicRichText field={item.data.text} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
