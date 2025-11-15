import Link from 'next/link'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function CVPage() {
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
          
          <h1 className="project-title">CV</h1>
          
          <div className="project-info">
            <p>
              <a 
                href="https://www.dropbox.com/scl/fi/7gszaelfhz39p7nscdocm/Johnson-CV-Works-Links.pdf?rlkey=qrfdfaypbp7hhqt1dno8az4pl&st=ilarwwb2&dl=0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV (PDF)
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
