const works = [
  {
    id: 'ameyoke',
    title: '雨避け',
    event: 'ハックツハッカソン dipカップ2026',
    award: '玄人部門最優秀賞',
    summary:
      'VR（PICO 4 Ultra）で、雨を避けるモードと殴り飛ばすモードを遊べるゲーム。小学生の頃にやりたかった「雨を避ける」という夢を叶える。',
    tags: ['WebXR', 'Three.js', 'JavaScript'],
    repoUrl: 'https://github.com/Tanakee/hackz-20268-ameyoke',
    refUrl: 'https://topaz.dev/projects/90585c6bfc58d2dc841a',
  },
  {
    id: 'needea',
    title: 'needea',
    event: '技育CAMPハッカソン',
    summary:
      'エンジニアでも非エンジニアでも、思いついたアイデアや普段の不満を投稿できるサイト。',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Supabase', 'Vercel'],
    repoUrl: 'https://github.com/Tanakee/geekcamp-20264-needea',
    demoUrl: 'https://needea-lake.vercel.app',
  },
  {
    id: 'penguin',
    title: 'ファースト肯定ペンギン',
    event: 'Progateハッカソン',
    award: 'OB賞',
    summary:
      '最初に拍手をした観客（ファーストペンギン）を検知してARでペンギン化し、その肯定アクションをAWSでデータ化・分析するシステム。',
    tags: ['Python', 'WebSocket', 'AWS', 'React', 'TypeScript', 'Next.js'],
    repoUrl: 'https://github.com/Tanakee/progate-20264-penguin',
  },
  {
    id: 'iinamitattenne',
    title: 'いい波立ってんね〜',
    event: 'ハックツハッカソン',
    summary: '議論を物理現象として可視化する、SNS風の議論プラットフォーム。',
    tags: ['Vue.js', 'Node.js', 'PHP', 'Docker'],
    repoUrl: 'https://github.com/Tanakee/hackz-20263-iinamitattenne',
  },
  {
    id: 'baton',
    title: 'batON',
    event: '技育CAMPハッカソン',
    summary:
      '受けた恩を別の誰かへ「バトン」のように繋いでいく、恩送り記録・可視化アプリ。',
    tags: ['Swift', 'SwiftUI', 'Node.js', 'Redis', 'Docker'],
    repoUrl: 'https://github.com/Tanakee/geekcamp1-20262-batON',
  },
  {
    id: 'shabelang',
    title: '喋Lang（しゃべらんぐ）',
    event: '技育CAMPハッカソン',
    award: 'サポーターズ賞',
    summary:
      '外国語学習者が、日常で出会った知らない単語やフレーズを音声・文字・画像で瞬時に記録し、効率的に復習できる多機能メモアプリ。',
    tags: ['React Native', 'Firebase', 'Azure'],
    repoUrl: 'https://github.com/Tanakee/geekcamp19-20261-ShabeLang',
    demoUrl: 'http://tanakee.com/geekcamp19-20261-ShabeLang/',
  },
  {
    id: 'tori',
    title: 'TwiDo',
    event: 'はじめてのハッカソン',
    award: '優秀賞（2位）',
    summary: '仕事と私生活のタスクを分けて管理し、バランスをとるToDoアプリ。',
    tags: ['React Native', 'Expo', 'TypeScript'],
    repoUrl: 'https://github.com/Tanakee/voltech-202512-tori',
    refUrl: 'https://topaz.dev/projects/f7aedf107da427e7bfc6',
  },
  {
    id: 'futatabi',
    title: 'フタタビ',
    event: 'SPAJAM',
    summary: 'GPSで近くのユーザーを検出し、その日撮った写真を自動で交換するアプリ。2人チームで開発。',
    tags: ['React Native', 'TypeScript', 'React'],
    repoUrl: 'https://github.com/spajam-jp/spajam2026-2-14',
  },
  {
    id: 'sharekeep',
    title: 'ShareKeep',
    event: '58ハッカソン',
    award: 'GDGoC賞',
    summary:
      '再配達を減らす目的で、不在時に近くの代理人に荷物を預かってもらうことを橋渡しするアプリ。',
    tags: ['React Native', 'Python', 'Three.js'],
    repoUrl: 'https://github.com/0ch1a1/58hack2026-6_TeamKouka',
    refUrl: 'https://topaz.dev/projects/026660816091e17c20b9',
  },
  {
    id: 'kasoubrain',
    title: '誘う仮想脳との遭遇',
    event: 'ハックツ アロカップ2026',
    award: '特別賞（3位）',
    summary:
      'ロケーション由来の体験を楽しく拡張することが目的。スマートグラスが提示するコンピュータの提案ポイントを実際に訪問し、案内するアプリケーション。',
    tags: ['Even G2 SDK', 'Kubernetes', 'React Native', 'Expo', 'Node.js'],
    repoUrl: 'https://github.com/IcchyHiroki/HairpinRefactor-Hakkutsu2026',
    refUrl: 'https://topaz.dev/projects/ef1f60695ff4ac55d172',
  },
  {
    id: 'tabipon',
    title: 'たびぽん',
    event: 'Progateハッカソン',
    award: '最優秀賞（1位）',
    summary:
      'スポットを訪れ、スマホのカメラでランドマークを撮影して、その写真からオリジナルのスタンプを作成するスタンプ集めアプリ。振りかぶって振り下ろすと実際にスタンプを押したような体験ができる。',
    tags: ['React Native', 'Expo', 'TypeScript'],
    repoUrl: 'https://github.com/monarizzz/tabipon',
    refUrl: 'https://topaz.dev/projects/8af82f7dea8d61828a3e',
  },
  {
    id: 'geolog',
    title: 'Geolog',
    event: 'チャレキャラ',
    summary: '地図上の現在地に日記を設置し、近づくと他の人でも読めるアプリ。',
    tags: ['React Native', 'Expo', 'TypeScript', 'Vercel'],
    repoUrl: 'https://github.com/Tanakee/smd-project-1',
  },
]

export default works
