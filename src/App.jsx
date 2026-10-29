import Nav from './components/Nav.jsx'
import Frog3D from './components/Frog3D.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Works from './sections/Works.jsx'
import Contact from './sections/Contact.jsx'

export default function App() {
  return (
    <div className="relative">
      <Frog3D className="pointer-events-none fixed inset-0 z-40 h-screen w-screen" />
      <Nav />
      <Hero />
      <About />
      <Works />
      <Contact />
    </div>
  )
}
