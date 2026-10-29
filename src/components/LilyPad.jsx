import { motion, useMotionValue, useSpring } from 'framer-motion'

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4C24 4 28 12 28 20C28 25 22.5 28 16 28C9.5 28 4 25 4 20C4 12 8 4 16 4Z"
        fill="#dcecd5"
      />
      <path d="M16 6V27" stroke="#8fc08a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function LilyPad({ work }) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 4)
    rotateX.set(-py * 4)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      className="flex flex-col rounded-3xl border border-pond-line bg-pond-surface p-7 shadow-card transition-shadow duration-300 hover:shadow-soft"
    >
      <div className="flex items-start justify-between">
        <LeafIcon />
        <p className="text-right font-display text-[11px] uppercase tracking-wider text-pond-muted">
          {work.event}
        </p>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold text-pond-text">{work.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-pond-muted">{work.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {work.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-pond-bg px-3 py-1 text-xs font-semibold text-pond-greenDark"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-pond-line pt-4">
        <a href={work.repoUrl} target="_blank" rel="noreferrer" className="text-link">
          GitHub
        </a>
        {work.demoUrl && (
          <a href={work.demoUrl} target="_blank" rel="noreferrer" className="text-link">
            Demo
          </a>
        )}
        {work.refUrl && (
          <a href={work.refUrl} target="_blank" rel="noreferrer" className="text-link">
            詳細資料
          </a>
        )}
      </div>
    </motion.div>
  )
}
