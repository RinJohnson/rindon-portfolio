import Link from 'next/link'
import { asText } from '@prismicio/client'
import { PrismicRichText } from '@prismicio/react'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function NewsPage() {
  const allWorks = await client.getAllByType('work_item')
  
  // Fetch all news items from 2022 onwards
  const newsItems = await client.getAllByType('news_item', {
    orderings: [
      { field: 'my.news_item.date', direction: 'desc' }
    ]
  })

  // Filter for 2022 onwards
  const filteredNews = newsItems.filter(item => {
    if (!item.data.date) return false
    const year = new Date(item.data.date).getFullYear()
    return year >= 2022
  })

  return (
    <>
      <Navigation shows={allWorks} works={allWorks} />
      <CursorTracker />
      
      <main className="main-content">
        <div className="project-view">
          <Link href="/" className="back-link">
            ←
          </Link>
          
          <h1 className="project-title">News</h1>
          
          <div className="project-info" style={{ maxWidth: '800px' }}>
            {filteredNews.length === 0 ? (
              <p>No news items yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {filteredNews.map((item) => {
                  const title = item.data.title ? asText(item.data.title) : 'Untitled'
                  const date = item.data.date ? new Date(item.data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''
                  const location = item.data.location ? asText(item.data.location) : ''
                  const time = item.data.time ? asText(item.data.time) : ''
                  
                  return (
                    <div key={item.id} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '30px' }}>
                      <div style={{ fontSize: '14px', marginBottom: '5px', opacity: 0.7 }}>
                        {date}
                        {location && ` • ${location}`}
                        {time && ` • ${time}`}
                      </div>
                      
                      <h2 style={{ fontSize: '14px', fontWeight: 400, marginBottom: '10px' }}>
                        {item.data.external_link && item.data.external_link.url ? (
                          <a 
                            href={item.data.external_link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'var(--text-color)', textDecoration: 'none' }}
                          >
                            {title}
                          </a>
                        ) : (
                          title
                        )}
                      </h2>
                      
                      {item.data.blurb && (
                        <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                          <PrismicRichText field={item.data.blurb} />
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
