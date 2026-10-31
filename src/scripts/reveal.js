// Fades [data-reveal] elements in once they scroll into view. The attribute value is
// how much of the element must be visible (0–1) before it reveals, and it only plays once.
const elements = document.querySelectorAll('[data-reveal]')

const byThreshold = new Map()
for (const element of elements) {
  const threshold = Number(element.dataset.reveal) || 0
  if (!byThreshold.has(threshold)) byThreshold.set(threshold, [])
  byThreshold.get(threshold).push(element)
}

for (const [threshold, group] of byThreshold) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    { threshold },
  )
  group.forEach((element) => observer.observe(element))
}
