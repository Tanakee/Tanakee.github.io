import { motion } from 'framer-motion'
import Pond from '../components/Pond.jsx'

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-pond-bg px-6 py-28 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-xl flex-col items-center text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-pond-muted">Contact</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-pond-text md:text-4xl">
          また池のほとりで
        </h2>
        <p className="mt-4 text-base text-pond-muted">
          新しいプロダクトの話やハッカソンのお誘いなど、お気軽にどうぞ。
        </p>
        <a
          href="https://github.com/Tanakee"
          target="_blank"
          rel="noreferrer"
          className="leaf-btn mt-8"
        >
          GitHub で連絡する
        </a>
      </motion.div>

      <Pond
        className="mx-auto mt-16 w-72 md:absolute md:bottom-12 md:left-[4%] md:mt-0 md:w-[24rem]"
        leaves={[{ x: -0.8, z: 0.2, size: 0.9, rotate: 2.5 }]}
      />

      <footer className="mt-24 text-center text-xs text-pond-muted/70">
        © {new Date().getFullYear()} Tanakee
      </footer>
    </section>
  )
}
