import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PricingPage from './pages/PricingPage'
import Changelog from './pages/Changelog'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="changelog" element={<Changelog />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
