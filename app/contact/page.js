import Link from 'next/link'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function ContactPage() {
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
          
          <h1 className="project-title">Contact</h1>
          
          <div className="project-info">
            <p>
              For inquiries, please email:<br />
              <a href="mailto:rindonjohnsonstudio@protonmail.com">
                rindonjohnsonstudio@protonmail.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
