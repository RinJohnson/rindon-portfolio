import Link from 'next/link'
import { asText } from '@prismicio/client'
import { client } from '../prismicio'
import Navigation from '../components/Navigation'
import CursorTracker from '../components/CursorTracker'

const gradientColors = [
  '#c8c8c8',
  '#b8b8b8',
  '#a8a8a8',
  '#989898',
  '#888888',
  '#787878',
  '#686868',
  '#585858',
  '#484848',
  '#383838',
]

export default async function Home() {
  try {
    const works = await client.getAllByType('work_item', {
      orderings: [
        { field: 'my.work_item.project_date', direction: 'desc' },
        { field: 'document.first_publication_date', direction: 'desc' }
      ]
    })

    return (
      <>
        <Navigation shows={works} works={works} />
        <CursorTracker />
        
        <main className="main-content">
          <div className="landing-list">
            {works.map((work, index) => {
              // Extract title from Rich Text field - same pattern as work page
              const title = work.data.project_title 
                ? asText(work.data.project_title)
                : 'Untitled'
              
              // Extract year from date - same pattern as work page
              const year = work.data.project_date 
                ? new Date(work.data.project_date).getFullYear()
                : ''

              return (
                <Link 
                  key={work.id}
                  href={`/work/${work.uid}`} 
                  className="landing-item"
                  style={{ 
                    background: gradientColors[index % gradientColors.length] 
                  }}
                >
                  <div className="landing-item-content">
                    <div className="landing-item-title">
                      {title}
                    </div>
                    <div className="landing-item-info">
                      {year}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error in Home page:', error)
    return (
      <>
        <Navigation shows={[]} works={[]} />
        <CursorTracker />
        <main className="main-content">
          <div style={{ padding: '30px' }}>
            Error loading works. Please try again later.
          </div>
        </main>
      </>
    )
  }
}
