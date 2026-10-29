import { motion } from 'framer-motion'

const links = [
  { label: 'About',     href: '#about' },
  { label: 'Interests', href: '#interests' },
  { label: 'Works',     href: '#works' },
]

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-4"
      style={{
        background: 'rgba(7, 30, 19, 0.82)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(77, 172, 107, 0.18)',
      }}
    >
      <span className="font-fredoka text-2xl text-accent glow-green">tanakee 🐸</span>

      <div className="flex items-center gap-6">
        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-nunito font-700 text-base text-muted hover:text-text transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/tanakee"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center rounded-full w-9 h-9 transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(45,122,74,0.2)',
              border: '1px solid rgba(93,187,99,0.3)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#d4eed9">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://x.com/Tanakee01"
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)"
            className="flex items-center justify-center rounded-full w-9 h-9 transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(126,200,227,0.12)',
              border: '1px solid rgba(126,200,227,0.25)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#d4eed9">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
