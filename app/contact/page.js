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
          
          <div className="project-info" style={{ maxWidth: '800px' }}>
            <p>For inquiries:</p>
            <br />
            <p>Email: contact@rinjohnson.com</p>
            <br />
            <p>Representation: [Your gallery/agent info]</p>
          </div>
        </div>
      </main>
    </>
  )
}
