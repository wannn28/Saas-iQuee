import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="wrap py-24 lg:py-36">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-[64px] sm:text-[112px]">This slot is <span className="mark-go">empty</span>.</h1>
      <p className="mt-6 max-w-md text-[19px] text-ink-2">The page you were looking for doesn’t exist — unlike our waitlist, nobody is lined up to take its place.</p>
      <Link to="/" className="btn-ink mt-10">Back to home</Link>
    </div>
  )
}
