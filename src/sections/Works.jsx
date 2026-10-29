import works from '../data/works.js'
import LilyPad from '../components/LilyPad.jsx'

export default function Works() {
  return (
    <section id="works" className="relative bg-pond-bg px-6 py-28 md:px-12">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-pond-muted">Works</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-pond-text md:text-4xl">
          制作物たち
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
        {works.map((work) => (
          <LilyPad key={work.id} work={work} />
        ))}
      </div>
    </section>
  )
}
