import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="relative bg-pond-bg px-6 py-28 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-pond-muted">About</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-pond-text md:text-4xl">
          フロントエンド開発者
        </h2>
        <p className="mt-6 text-base leading-relaxed text-pond-muted md:text-lg">
          React × Three.js のようなインタラクティブなUIを作るのが好きで、ハッカソンに積極的に参加しています。
          アイデアを素早く形にして、遊び心のある体験を届けることを大事にしています。
        </p>
        <a
          href="https://github.com/Tanakee"
          target="_blank"
          rel="noreferrer"
          className="leaf-btn mt-8 inline-flex"
        >
          GitHub を見る
        </a>
      </motion.div>
    </section>
  )
}
