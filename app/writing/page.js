import Link from 'next/link'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function WritingPage() {
  const allWorks = await client.getAllByType('work_item')

  return (
    <>
      <Navigation shows={allWorks} works={allWorks} />
      <CursorTracker />
      
      <main className="main-content">
        <div className="project-view">
          <Link href="/" className="back-link">
            ←
          </Link>
          
          <h1 className="project-title">Writing</h1>
          
          <div className="project-info" style={{ maxWidth: '800px' }}>
            <p>Essays, fiction, poetry, and other writings.</p>
          </div>
        </div>
      </main>
    </>
  )
}
