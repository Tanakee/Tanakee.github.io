// Ponds live in their own canvases inside the page flow, while the frog lives in a
// fixed full-screen canvas. Ponds register here so the frog can ask, in screen
// coordinates, whether a point is on water and make ripples there.
const ponds = new Set()

export function registerPond(pond) {
  ponds.add(pond)
  return () => ponds.delete(pond)
}

export function findPondAt(clientX, clientY) {
  for (const pond of ponds) {
    if (pond.contains(clientX, clientY)) return pond
  }
  return null
}
