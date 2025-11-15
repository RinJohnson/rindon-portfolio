import './globals.css'

export const metadata = {
  title: 'Rindon Johnson',
  description: 'Artist portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
