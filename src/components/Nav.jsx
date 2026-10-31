const links = [
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-pond-bg/80 px-6 py-5 backdrop-blur-xs md:px-12">
      <a href="#hero" className="font-display text-lg font-bold text-pond-text">
        tanakee
      </a>
      <ul className="flex gap-7 font-display text-sm font-semibold text-pond-muted">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="transition-colors hover:text-pond-greenDark">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
