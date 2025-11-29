import Link from 'next/link'
import { asText } from '@prismicio/client'
import { client } from '../prismicio'
import Navigation from '../components/Navigation'
import CursorTracker from '../components/CursorTracker'

const gradientColors = [
  '#FAF8F5',  // Light cream
  '#F5F0E8',  // Cream
  '#EBE3D6',  // Warm cream
  '#E0D4C4',  // Light tan
  '#D4C4B0',  // Soft tan
  '#C8B49C',  // Light brown
  '#B89F82',  // Warm tan
  '#A68A6A',  // Medium brown
  '#8B7355',  // Warm brown
  '#6B5344',  // Deep brown
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
