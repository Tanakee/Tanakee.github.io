import { motion } from 'framer-motion'
import { Suspense } from 'react'
import WorksScene from '../components/WorksScene'

export const works = [
  {
    title: 'Portfolio Site',
    description: 'Three.js × React で作ったカエルをテーマにしたポートフォリオサイト。雨降る池の3Dシーンが特徴。',
    tags: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    kind: '個人開発',
    github: 'https://github.com/Tanakee/Tanakee.github.io',
    demo: 'https://tanakee.github.io',
    emoji: '🐸',
    color: '#1a4a2a',
  },
  {
    title: 'Needea',
    description: '日常の不満・アイデアを投稿してエンジニアの開発ネタにつなげる、アイデアハブ。',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    kind: 'ハッカソン',
    hackathon: { name: '技育CAMPハッカソン', organizer: 'サポーターズ', date: '2026-04', role: 'フロントエンド' },
    github: 'https://github.com/Tanakee/geekcamp-20264-needea',
    demo: '#',
    emoji: '💡',
    color: '#3a3510',
  },
  {
    title: 'batON',
    description: '受けた恩を別の人へバトンのように繋いでいく、恩送りの記録・可視化iOSアプリ。SwiftUI + SceneKitで実装。',
    tags: ['Swift', 'SwiftUI', 'SceneKit', 'GraphQL', 'PostgreSQL'],
    kind: 'ハッカソン',
    hackathon: { name: '技育CAMPハッカソン', organizer: 'サポーターズ', date: '2026-02', role: 'iOSフロントエンド' },
    github: 'https://github.com/Tanakee/geekcamp1-20262-batON',
    demo: '#',
    emoji: '🏃',
    color: '#3a1818',
  },
  {
    title: '喋Lang',
    description: '外国語学習者が音声・文字・画像でリアルタイムに単語を記録・復習できる多機能メモアプリ。Expo（React Native）で実装。',
    tags: ['TypeScript', 'Expo', 'React Native'],
    kind: 'ハッカソン',
    hackathon: { name: '技育CAMPハッカソン', organizer: 'サポーターズ', date: '2026-01', role: 'フロントエンド' },
    github: 'https://github.com/Tanakee/geekcamp19-20261-ShabeLingo',
    demo: '#',
    emoji: '🗣️',
    color: '#0d2a2a',
  },
  {
    title: 'いい波立ってんね',
    description: '議論を重力・熱量・風化などの物理現象として捉えてリアルタイムに可視化する、議論プラットフォーム。',
    tags: ['Vue.js', 'Canvas', 'Node.js', 'PHP', 'MySQL'],
    kind: 'ハッカソン',
    hackathon: { name: 'ハックツハッカソン', organizer: '株式会社ハックツ', date: '2026-03', role: 'フロントエンド' },
    github: 'https://github.com/Tanakee/hackz-20263-iinamitattenne',
    demo: '#',
    emoji: '🌊',
    color: '#18123a',
  },
  {
    title: 'ファースト肯定ペンギン',
    description: '最初に拍手した観客をカメラで検知しARでペンギン化。MediaPipe + OpenCVで検出しAWSでデータ分析するシステム。',
    tags: ['Python', 'MediaPipe', 'OpenCV', 'AWS', 'Docker'],
    kind: 'ハッカソン',
    hackathon: { name: 'Progateハッカソン', organizer: '株式会社Progate', date: '2026-04', role: 'バックエンド / CV' },
    github: 'https://github.com/Tanakee/progate-20264-penguin',
    demo: '#',
    emoji: '🐧',
    color: '#0d2a22',
  },
  {
    title: 'tori',
    description: '仕事とプライベートのバランスを可視化し、「やる気が出ない」時でも無理なくタスクをこなせるように設計された、React Native製タスク管理アプリ',
    tags: ['TypeScript', 'Expo', 'React Native'],
    kind: 'ハッカソン',
    hackathon: { name: 'はじめてのハッカソン', organizer: 'Voltech', date: '2025-12', role: 'フロントエンド' },
    github: 'https://github.com/Tanakee/voltech-202512-tori',
    demo: '#',
    emoji: '🐦',
    color: '#2a1e0d',
  },
]

export default function Works() {
  return (
    <section id="works" className="py-28 overflow-hidden" style={{ background: '#0c2317' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-fredoka text-5xl md:text-6xl text-text glow-green mb-3 text-center"
        >
          Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="font-nunito text-center text-muted mb-2 text-sm"
        >
        </motion.p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-96 font-nunito text-muted">
          Loading...
        </div>
      }>
        <WorksScene works={works} />
      </Suspense>
    </section>
  )
}
