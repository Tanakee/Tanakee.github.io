import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const interests = [
  {
    emoji: '📱',
    label: 'Native Apps',
    desc: 'SwiftUI / React Native / Expo でネイティブアプリを構築',
    color: '#e87a9f',
    glow: 'rgba(232,122,159,0.25)',
  },
  {
    emoji: '🥽',
    label: 'VR / 3D',
    desc: 'Three.js · WebXR · SceneKit で空間表現を探求',
    color: '#5dbb63',
    glow: 'rgba(93,187,99,0.25)',
  },
  {
    emoji: '🇰🇷',
    label: 'Korean',
    desc: '韓国語学習中。語学 × テックの掛け合わせに興味あり',
    color: '#7ec8e3',
    glow: 'rgba(126,200,227,0.25)',
  },
]

function InterestCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative flex flex-col items-center text-center gap-4 p-8 rounded-3xl pond-card"
      style={{
        '--glow': item.glow,
        boxShadow: `0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
      }}
    >
      {/* Glow accent top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />

      {/* Floating emoji */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.8 + index * 0.4, ease: 'easeInOut' }}
        className="relative"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: `radial-gradient(circle, ${item.glow} 0%, rgba(13,51,32,0.6) 100%)`,
            border: `1px solid ${item.color}44`,
            boxShadow: `0 0 24px ${item.glow}`,
          }}
        >
          {item.emoji}
        </div>
      </motion.div>

      <h3
        className="font-fredoka text-2xl"
        style={{ color: item.color }}
      >
        {item.label}
      </h3>

      <p className="font-nunito text-sm text-muted leading-relaxed max-w-xs">
        {item.desc}
      </p>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}88, transparent)` }}
      />
    </motion.div>
  )
}

export default function Interests() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="interests"
      className="py-28 px-6 md:px-16 overflow-hidden"
      style={{ background: 'rgba(7,30,19,0.82)', backdropFilter: 'blur(6px)' }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-fredoka text-5xl md:text-6xl text-sub glow-pink mb-4 text-center"
        >
          Interests
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="font-nunito text-center text-muted mb-14 text-sm"
        >
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {interests.map((item, i) => (
            <InterestCard key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
