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
            const title = work.data.intro_text && work.data.intro_text.length > 0
              ? asText(work.data.intro_text)
              : 'Untitled'
            
            const year = work.data.date 
              ? new Date(work.data.date).getFullYear()
              : ''
            
            const location = work.data.location && work.data.location.length > 0
              ? asText(work.data.location)
              : ''

            return (
              <Link 
                key={work.id}
                href={`/work/${work.uid}`}
                className="landing-item"
                style={{ background: gradientColors[index % gradientColors.length] }}
              >
                <div className="landing-item-content">
                  <div className="landing-item-title">{title}</div>
                  <div className="landing-item-info">
                    {location && year ? `${location} / ${year}` : location || year}
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
