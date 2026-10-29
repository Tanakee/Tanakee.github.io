import { useEffect, useRef, useState } from 'react'

export default function CursorTrail() {
  const cursorRef = useRef(null)
  const [drops, setDrops] = useState([])
  const dropsRef = useRef([])

  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }

      const id = Date.now() + Math.random()
      const drop = { id, x: e.clientX, y: e.clientY }
      dropsRef.current = [...dropsRef.current.slice(-10), drop]
      setDrops([...dropsRef.current])

      setTimeout(() => {
        dropsRef.current = dropsRef.current.filter((d) => d.id !== id)
        setDrops([...dropsRef.current])
      }, 500)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* Raindrop cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 9999,
          width: 11,
          height: 15,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          background: 'rgba(126, 200, 227, 0.85)',
          border: '1px solid rgba(126, 200, 227, 0.5)',
          boxShadow: '0 0 8px rgba(126, 200, 227, 0.4)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Ripple trail */}
      {drops.map((drop, i) => (
        <div
          key={drop.id}
          className="fixed pointer-events-none rounded-full"
          style={{
            zIndex: 9998,
            left: drop.x,
            top: drop.y,
            width: 6,
            height: 6,
            border: '1px solid rgba(126, 200, 227, 0.5)',
            transform: 'translate(-50%, -50%)',
            opacity: ((i + 1) / drops.length) * 0.55,
            background: i % 3 === 0
              ? 'rgba(93, 187, 99, 0.3)'
              : i % 3 === 1
              ? 'rgba(126, 200, 227, 0.3)'
              : 'rgba(232, 122, 159, 0.3)',
          }}
        />
      ))}
    </>
  )
}
