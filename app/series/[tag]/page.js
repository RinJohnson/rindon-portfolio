import Link from 'next/link'
import { client } from '../../../prismicio'
import Navigation from '../../../components/Navigation'
import CursorTracker from '../../../components/CursorTracker'

const grayColors = [
  '#e8e8e8',
  '#d0d0d0',
  '#b8b8b8',
  '#a0a0a0',
  '#888888',
  '#707070',
  '#585858',
]

export async function generateStaticParams() {
  const allWorks = await client.getAllByType('work_item')
  const tags = new Set()
  
  allWorks.forEach(work => {
    if (work.data.tags) {
      work.data.tags.forEach(tag => tags.add(tag))
    }
  })
  
  return Array.from(tags).map((tag) => ({
    tag: tag,
  }))
}

export default async function SeriesPage({ params }) {
  const { tag } = params
  const allWorks = await client.getAllByType('work_item')
  
  // Filter works by tag
  const seriesWorks = allWorks.filter(work => 
    work.data.tags && work.data.tags.includes(tag)
  )

  // Convert tag to display name
  const displayName = tag.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return (
    <>
      <Navigation shows={allWorks} works={allWorks} />
      <CursorTracker />
      
      <main className="main-content">
        <div className="project-view">
          <Link href="/" className="back-link">
            ←
          </Link>
          
          <h1 className="project-title">{displayName}</h1>
        </div>

        <div className="landing-list">
          {seriesWorks.map((work, index) => (
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
