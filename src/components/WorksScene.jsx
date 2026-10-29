import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

function BackgroundDeco() {
  const groupRef = useRef()
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.05
  })
  const items = [
    [-5, 2, -2], [5, -1.5, -2], [0, 3, -3],
    [-4, -2.5, -1.5], [4, 2.5, -1.5], [-2, 3.5, -3], [2, -3, -2],
  ]
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#FF8B94', '#A8E6CF', '#FFD93D']
  return (
    <group ref={groupRef}>
      {items.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <octahedronGeometry args={[0.22]} />
          <meshToonMaterial color={colors[i]} />
        </mesh>
      ))}
    </group>
  )
}

function CardButton({ href, bg, color, children, target, rel }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => e.stopPropagation()}
      style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: 13,
        fontWeight: 800,
        padding: '6px 16px',
        background: bg,
        border: '2px solid #2C2C2C',
        borderRadius: 20,
        color,
        textDecoration: 'none',
        boxShadow: hovered ? '0px 0px 0 #2C2C2C' : '2px 2px 0 #2C2C2C',
        transform: hovered ? 'translate(2px, 2px) scale(1.06)' : 'translate(0, 0) scale(1)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        display: 'inline-block',
      }}
    >
      {children}
    </a>
  )
}

const badgeColors = {
  ハッカソン: '#FF6B6B',
  個人開発: '#4ECDC4',
  チーム開発: '#6C5CE7',
}

function ExpandedCard({ work, onClose }) {
  const badge = badgeColors[work.kind]
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(44,44,44,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Expanded card */}
        <motion.div
          layoutId={`card-${work.title}`}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          style={{
            background: '#fff',
            borderRadius: 24,
            border: '3px solid #2C2C2C',
            boxShadow: '8px 8px 0 #2C2C2C',
            width: 'min(520px, 90vw)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#2C2C2C',
              color: '#fff',
              border: 'none',
              fontSize: 18,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              fontWeight: 800,
            }}
          >
            ✕
          </button>

          {/* Content */}
          <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: badge,
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                fontFamily: 'Nunito, sans-serif',
                padding: '3px 12px',
                borderRadius: 20,
                border: '2px solid #2C2C2C',
              }}>
                {work.kind}
              </span>
            </div>

            <div style={{
              fontFamily: '"Fredoka One", "M PLUS Rounded 1c", cursive',
              fontSize: 30,
              fontWeight: 800,
              color: '#2C2C2C',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}>
              {work.title}
            </div>

            <p style={{
              fontSize: 14,
              fontFamily: 'Nunito, sans-serif',
              color: '#444',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {work.description}
            </p>

            {work.hackathon && (
              <div style={{
                background: '#FFF3E0',
                border: '2px solid #2C2C2C',
                borderRadius: 14,
                padding: '12px 16px',
                fontFamily: 'Nunito, sans-serif',
                lineHeight: 1.8,
                color: '#2C2C2C',
              }}>
                <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>🏟️ ハッカソン情報</div>
                <div style={{ fontSize: 13 }}>📌 {work.hackathon.name}（{work.hackathon.organizer}）</div>
                <div style={{ fontSize: 13 }}>
                  📅 {work.hackathon.date}
                  {work.hackathon.duration && ` · ⏱ ${work.hackathon.duration}`}
                  {work.hackathon.members && ` · 👥 ${work.hackathon.members}人チーム`}
                </div>
                <div style={{ fontSize: 13 }}>🎨 担当: {work.hackathon.role}</div>
                {work.hackathon.award && (
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#FF6B6B', marginTop: 4 }}>{work.hackathon.award}</div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {work.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 12,
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  padding: '3px 10px',
                  background: '#e8f4ff',
                  border: '2px solid #2C2C2C',
                  borderRadius: 20,
                  color: '#2C2C2C',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <CardButton href={work.github} target="_blank" rel="noreferrer" bg="#FFD93D" color="#2C2C2C">
                🐙 GitHub
              </CardButton>
              <CardButton href={work.demo} bg="#FF6B6B" color="#fff">
                🔗 Demo
              </CardButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

function WorkCard({ work, onClick }) {
  const cardRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
    boxShadow: '5px 5px 0px #2C2C2C',
  })
  const badge = badgeColors[work.kind]

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTiltStyle({
      transform: `perspective(800px) rotateX(${-y * 22}deg) rotateY(${x * 22}deg) translateZ(16px)`,
      transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
      boxShadow: `${-x * 12 + 5}px ${y * 12 + 5}px 0px #2C2C2C`,
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
      boxShadow: '5px 5px 0px #2C2C2C',
    })
  }

  return (
    <motion.div
      layoutId={`card-${work.title}`}
      ref={cardRef}
      onClick={() => { handleMouseLeave(); onClick() }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      style={{
        ...tiltStyle,
        borderRadius: 20,
        border: '3px solid #2C2C2C',
        overflow: 'hidden',
        background: '#fff',
        cursor: 'pointer',
        width: 300,
        flexShrink: 0,
      }}
    >
      {/* Content */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{
          alignSelf: 'flex-start',
          background: badge,
          color: '#fff',
          fontSize: 11,
          fontWeight: 800,
          fontFamily: 'Nunito, sans-serif',
          padding: '2px 10px',
          borderRadius: 20,
          border: '2px solid #2C2C2C',
        }}>
          {work.kind}
        </span>

        <div style={{
          fontFamily: '"Fredoka One", "M PLUS Rounded 1c", cursive',
          fontSize: 22,
          fontWeight: 800,
          color: '#2C2C2C',
          letterSpacing: '0.02em',
        }}>
          {work.title}
        </div>

        <p style={{
          fontSize: 12,
          fontFamily: 'Nunito, sans-serif',
          color: '#555',
          lineHeight: 1.5,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {work.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {work.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              padding: '2px 8px',
              background: '#e8f4ff',
              border: '2px solid #2C2C2C',
              borderRadius: 20,
              color: '#2C2C2C',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 11,
          color: '#999',
          margin: 0,
          textAlign: 'right',
        }}>
          クリックで詳細 →
        </p>
      </div>
    </motion.div>
  )
}

export default function WorksScene({ works }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* R3F background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <BackgroundDeco />
          </Suspense>
        </Canvas>
      </div>

      {/* Cards */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        padding: '40px 24px 60px',
        flexWrap: 'wrap',
      }}>
        {works.map((work) => (
          <WorkCard key={work.title} work={work} onClick={() => setSelected(work)} />
        ))}
      </div>

      {/* Expanded modal */}
      <AnimatePresence>
        {selected && (
          <ExpandedCard key={selected.title} work={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
