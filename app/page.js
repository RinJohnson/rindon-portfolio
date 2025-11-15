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
  try {
    const works = await client.getAllByType('work_item', {
      orderings: [
        { field: 'my.work_item.year', direction: 'desc' },
        { field: 'document.first_publication_date', direction: 'desc' }
      ]
    })

    console.log('Fetched works:', works.length)

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
                    {work.data.title || work.data.Title || 'Untitled'}
                  </div>
                  <div className="landing-item-info">
                    {work.data.venue && `${work.data.venue}`}
                    {work.data.Venue && `${work.data.Venue}`}
                    {work.data.location && `, ${work.data.location}`}
                    {work.data.Location && `, ${work.data.Location}`}
                    {work.data.year && ` / ${work.data.year}`}
                    {work.data.Year && ` / ${work.data.Year}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error fetching works:', error)
    return (
      <>
        <Navigation shows={[]} works={[]} />
        <CursorTracker />
        <main className="main-content">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Error loading content</h1>
            <p>Please check your Prismic configuration</p>
          </div>
        </main>
      </>
    )
  }
}
