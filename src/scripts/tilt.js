// Tilts [data-tilt] cards a few degrees toward the pointer. Uses `transform` so it
// stays independent of the reveal animation, which animates `translate`.
const MAX_TILT = 4

for (const card of document.querySelectorAll('[data-tilt]')) {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(900px) rotateX(${-py * MAX_TILT}deg) rotateY(${px * MAX_TILT}deg)`
  })
  card.addEventListener('mouseleave', () => {
    card.style.transform = ''
  })
}
