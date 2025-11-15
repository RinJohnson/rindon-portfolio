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
    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach(tag => tags.add(tag))
    }
  })
  
  return Array.from(tags).map((tag) => ({
    tag: String(tag),
  }))
}

export default async function SeriesPage({ params }) {
  const { tag } = params
  const allWorks = await client.getAllByType('work_item')
  
  // Filter works by tag
  const seriesWorks = allWorks.filter(work => 
    work.tags && Array.isArray(work.tags) && work.tags.includes(tag)
  )

  // Convert tag to display name
  const displayName = tag.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return (
    <>
      <Navigation shows={all
                          "Fix series page syntax error" 
