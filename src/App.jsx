import { Suspense } from 'react'
import Navbar from './components/Navbar'
import CursorTrail from './components/CursorTrail'
import FrogScene from './components/FrogScene'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Works from './sections/Works'
import Footer from './sections/Footer'

export default function App() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={null}>
          <FrogScene />
        </Suspense>
      </div>
      <CursorTrail />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Works />
      </main>
      <Footer />
    </>
  )
}
