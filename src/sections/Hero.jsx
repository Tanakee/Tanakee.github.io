import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="hero" className="relative flex h-screen flex-col items-center justify-between overflow-hidden bg-pond-bg pt-28">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.3em] text-pond-muted">
          Portfolio
        </p>
        <h1 className="mt-3 font-display text-5xl font-extrabold text-pond-text md:text-7xl">
          Tanakee
        </h1>
        <p className="mt-4 max-w-md text-base text-pond-muted md:text-lg">
          フロントエンド開発者。ハッカソンの制作物を紹介しています。
          <br />
          画面のどこかにいるカエルをクリックしてみてください。
        </p>
      </motion.div>

      <a href="#works" className="text-link relative z-10 mb-10">
        Works を見る ↓
      </a>
    </section>
  )
}
