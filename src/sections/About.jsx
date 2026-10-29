import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      className="py-28 px-6 md:px-16"
      style={{ background: 'rgba(7,30,19,0.82)', backdropFilter: 'blur(6px)' }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.h2
            variants={fadeUp}
            className="font-fredoka text-5xl md:text-6xl text-text glow-green mb-14 text-center"
          >
            About Me
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Avatar */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <div
                className="pond-card rounded-3xl w-60 h-60 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
              >
                <img src="/icon.png" alt="tanakee" className="w-44 h-44 rounded-2xl object-cover" />
                <span className="font-nunito text-sm text-muted">tanakee</span>
                {/* Decorative ripple rings */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(circle at 50% 60%, rgba(93,187,99,0.06) 0%, transparent 70%)',
                }} />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div variants={fadeUp} className="space-y-5">
              <p className="font-nunito text-lg text-text/85 leading-relaxed">
              こんにちは、たなけーです！🐸
              フロントエンドとモバイルアプリ開発を中心に、ユーザーの心に届くモノづくりを追求しているエンジニアです。
              </p>
              <p className="font-nunito text-lg text-text/85 leading-relaxed">
              私が最も大切にしているのは、ユーザーの視点に立った「見て楽しい」「触って楽しい」という直感的な体験（UX）です。
              UIの心地よいインタラクションや、使っていてワクワクするような演出にこだわりを持って開発に取り組んでいます。
              </p>
              <p className="font-nunito text-lg text-text/85 leading-relaxed">
              また、アイデアを素早くプロトタイプとして形にするのが得意で、ハッカソンなどのイベントにも積極的に挑戦しています。
              限られた時間の中で技術的な壁を乗り越え、新しい価値を生み出すプロセスが大好きです。
              技術を通じて、日常を少し楽しくするようなプロダクトをこれからも作り続けていきます！
              </p>

              <div className="flex gap-3 flex-wrap pt-2">
                <a
                  href="mailto:tanaka.kate01@gmail.com"
                  className="leaf-btn font-nunito font-bold px-5 py-2 rounded-full text-sm"
                >
                  ✉️ Email
                </a>
                <a
                  href="https://github.com/tanakee"
                  target="_blank"
                  rel="noreferrer"
                  className="pink-btn font-nunito font-bold px-5 py-2 rounded-full text-sm"
                >
                  🐙 GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
