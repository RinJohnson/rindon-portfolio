import Link from 'next/link'
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
            // Safely get title
            let title = 'Untitled'
            try {
              if (work.data?.project_title) {
                const titleData = work.data.project_title
                if (Array.isArray(titleData) && titleData.length > 0 && titleData[0].text) {
                  title = titleData[0].text
                } else if (typeof titleData === 'string') {
                  title = titleData
                }
              }
            } catch (e) {
              console.error('Error getting title:', e)
            }
            
            // Safely get year
            let year = ''
            try {
              if (work.data?.project_date) {
                year = new Date(work.data.project_date).getFullYear().toString()
              }
            } catch (e) {
              console.error('Error getting year:', e)
            }
            
            // Safely get location
            let location = ''
            try {
              if (work.data?.location) {
                const locationData = work.data.location
                if (Array.isArray(locationData) && locationData.length > 0 && locationData[0].text) {
                  location = locationData[0].text
                } else if (typeof locationData === 'string') {
                  location = locationData
                }
              }
            } catch (e) {
              console.error('Error getting location:', e)
            }

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
