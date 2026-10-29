import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 25%, rgba(7,30,19,0.45) 100%)',
        }}
      />

      {/* Content — pointer-events-none so clicks pass through to the 3D canvas */}
      <div
        className="relative z-10 text-center px-10 py-10 select-none pointer-events-none rounded-3xl"
        style={{ background: 'rgba(7,20,13,0.45)', backdropFilter: 'blur(4px)' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-nunito font-bold text-sm md:text-base text-rain glow-rain mb-3"
          style={{ letterSpacing: '0.3em' }}
        >
          ✦ WELCOME TO MY WORLD ✦
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.8, type: 'spring', stiffness: 70 }}
          className="font-fredoka text-7xl md:text-9xl text-text glow-green mb-4"
        >
          tanakee
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="font-nunito font-bold text-lg md:text-xl text-muted mb-8"
        >
          Student Engineer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex gap-4 justify-center flex-wrap pointer-events-auto"
        >
          <a href="#about" className="leaf-btn font-nunito font-bold px-8 py-3 rounded-full text-base">
            About Me
          </a>
          <a href="#works" className="pink-btn font-nunito font-bold px-8 py-3 rounded-full text-base">
            My Works
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-nunito text-xs text-muted/60">scroll down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full flex items-start justify-center pt-1"
          style={{ border: '1px solid rgba(106,158,122,0.4)' }}
        >
          <div className="w-1 h-2 bg-muted/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
