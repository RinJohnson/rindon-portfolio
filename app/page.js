import Link from 'next/link'
import { client } from '../prismicio'
import Navigation from '../components/Navigation'
import CursorTracker from '../components/CursorTracker'

// Define the gray gradient colors
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
  // Fetch all work items from Prismic
  const works = await client.getAllByType('work_item', {
    orderings: [
      { field: 'my.work_item.year', direction: 'desc' },
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
                  {work.data.title}
                </div>
                <div className="landing-item-info">
                  {work.data.venue && `${work.data.venue}`}
                  {work.data.location && `, ${work.data.location}`}
                  {work.data.year && ` / ${work.data.year}`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
