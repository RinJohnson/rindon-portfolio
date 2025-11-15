import Link from 'next/link'
import { asText } from '@prismicio/client'
import { client } from '../prismicio'
import Navigation from '../components/Navigation'
import CursorTracker from '../components/CursorTracker'
// White to Yves Klein Blue gradient
const gradientColors = [
  '#e8e8e8',
  '#d0d0d0',
  '#b8b8b8',
  '#a0a0a0',
  '#888888',
  '#707070',
  '#585858',
  '#404040',
  '#282828',
  '#101010',
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
