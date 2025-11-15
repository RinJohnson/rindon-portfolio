import Link from 'next/link'
import { asText } from '@prismicio/client'
import { client } from '../prismicio'
import Navigation from '../components/Navigation'
import CursorTracker from '../components/CursorTracker'
// White to Yves Klein Blue gradient
const gradientColors = [
  '#FFFFFF',  // White
  '#E6ECFA',  // Very light blue
  '#CCD9F5',  // Light blue
  '#B3C6F0',  // Lighter blue
  '#99B3EB',  // Medium-light blue
  '#80A0E6',  // Medium blue
  '#668DE1',  // Medium-strong blue
  '#4D7ADC',  // Strong blue
  '#3367D7',  // Deeper blue
  '#1A54D2',  // Very deep blue
  '#002FA7',  // Yves Klein Blue (IKB)
]
export default async function Home() {
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
            // Extract title from Rich Text field
            const title = work.data.project_title 
              ? asText(work.data.project_title)
              : 'Untitled'
            
            // Extract year from date
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
}
