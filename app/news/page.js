import Link from 'next/link'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function NewsPage() {
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
          
          <h1 className="project-title">News</h1>
          
          <div className="project-info">
            <p>News and updates coming soon.</p>
          </div>
        </div>
      </main>
    </>
  )
}
