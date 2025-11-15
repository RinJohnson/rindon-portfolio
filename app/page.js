import Link from 'next/link'
import { client } from '../prismicio'
import Navigation from '../components/Navigation'
import CursorTracker from '../components/CursorTracker'

const grayColors = [
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
          {works.map((work, index) => (
            <Link 
              key={work.id}
              href={`/work/${work.uid}`} 
              className="landing-item"
              style={{ 
                background: grayColors[index % grayColors.length] 
              }}
            >
              <div className="landing-item-content">
                <div className="landing-item-title">
                  {work.data.project_title || 'Untitled'}
                </div>
                <div className="landing-item-info">
                  {work.data.project_date && new Date(work.data.project_date).getFullYear()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
