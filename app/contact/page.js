import Link from 'next/link'
import { PrismicRichText } from '@prismicio/react'
import { client } from '../../prismicio'
import Navigation from '../../components/Navigation'
import CursorTracker from '../../components/CursorTracker'

export default async function ContactPage() {
  const allWorks = await client.getAllByType('work_item')
  
  // Fetch contact info from Prismic
  let contact = null
  try {
    contact = await client.getSingle('contact')
  } catch (error) {
    // Contact page not set up yet
  }

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
            {contact ? (
              <>
                {contact.data.email && (
                  <>
                    <p>
                      <a 
                        href={`mailto:${contact.data.email}`}
                        style={{ color: 'var(--text-color)', textDecoration: 'underline' }}
                      >
                     Email
                      </a>
                    </p>
                    <br />
                  </>
                )}
                
                {contact.data.contact_text && (
                  <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    <PrismicRichText field={contact.data.contact_text} />
                  </div>
                )}
              </>
            ) : (
              <p>Contact information coming soon.</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
