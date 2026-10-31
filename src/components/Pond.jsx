import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { useInView, useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { registerPond } from './pondRegistry.js'

const RADIUS_X = 1.6
const RADIUS_Z = 0.88
const VIEW_WIDTH = 4.4
const RAIN_INTERVAL = 2.6
const RIPPLE_LIFE = 1.8

// radius multipliers around the pond; the dips give it a lopsided, kidney-ish outline.
// The bank uses its own profile so its width varies instead of tracing the water evenly.
const WATER_WOBBLE = [1, 1.1, 1.05, 0.8, 0.9, 1.08, 1.12, 0.95, 0.76, 0.92, 1.04, 0.98]
const BANK_WOBBLE = [1.08, 1.16, 1.18, 0.94, 0.97, 1.14, 1.22, 1.03, 0.88, 1.0, 1.12, 1.06]
const BANK_SCALE = 1.06

const STONES = [
  { t: 0.02, r: 0.15, color: '#b9b3a4' },
  { t: 0.07, r: 0.09, color: '#cfc8b6' },
  { t: 0.3, r: 0.12, color: '#c4bdab' },
  { t: 0.52, r: 0.17, color: '#b3ad9e' },
  { t: 0.57, r: 0.1, color: '#cfc8b6' },
  { t: 0.84, r: 0.13, color: '#bfb8a7' },
]
const GRASS = [0.18, 0.43, 0.68, 0.94]

// irregular closed curve in the shape plane (XY); laid flat it becomes world XZ with z = -y
function blobCurve(scale, wobble = WATER_WOBBLE) {
  const points = wobble.map((w, i) => {
    const angle = (i / wobble.length) * Math.PI * 2
    return new THREE.Vector3(
      Math.cos(angle) * RADIUS_X * w * scale,
      Math.sin(angle) * RADIUS_Z * w * scale,
      0,
    )
  })
  return new THREE.CatmullRomCurve3(points, true)
}

function blobShape(scale, wobble) {
  const points = blobCurve(scale, wobble).getSpacedPoints(96)
  return new THREE.Shape(points.map((p) => new THREE.Vector2(p.x, p.y)))
}

// a point on the bank at curve parameter t, `along` 0 = water edge, 1 = outer edge
function bankPoint(t, along) {
  const inner = blobCurve(1).getPoint(t)
  const outer = blobCurve(BANK_SCALE, BANK_WOBBLE).getPoint(t)
  const p = inner.lerp(outer, along)
  return [p.x, -p.y]
}

function pointInPolygon(x, y, points) {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i]
    const b = points[j]
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside
    }
  }
  return inside
}

function CameraFit() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.zoom = size.width / VIEW_WIDTH
    camera.updateProjectionMatrix()
  }, [camera, size.width])
  return null
}

function Bank() {
  const geometry = useMemo(() => {
    const outer = blobShape(BANK_SCALE, BANK_WOBBLE)
    outer.holes.push(new THREE.Path(blobShape(1).getPoints()))
    return new THREE.ExtrudeGeometry(outer, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 5,
      curveSegments: 48,
    })
  }, [])

  return (
    <group>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#ddd3b8" roughness={0.9} />
      </mesh>
      {STONES.map(({ t, r, color }) => {
        const [x, z] = bankPoint(t, 0.45)
        return (
          <mesh
            key={t}
            position={[x, 0.06, z]}
            rotation={[0, t * 20, 0]}
            scale={[r * 1.3, r * 0.55, r]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[1, 20, 14]} />
            <meshStandardMaterial color={color} roughness={0.75} />
          </mesh>
        )
      })}
      {GRASS.map((t) => {
        const [x, z] = bankPoint(t, 0.85)
        return (
          <group key={t} position={[x, 0.05, z]} rotation={[0, t * 13, 0]}>
            {[-0.06, 0, 0.06].map((dx, i) => (
              <mesh
                key={dx}
                position={[dx, 0.11 + i * 0.03, 0]}
                rotation={[0, 0, -dx * 5]}
                castShadow
              >
                <coneGeometry args={[0.035, 0.24 + i * 0.06, 6]} />
                <meshStandardMaterial color="#6fae6c" roughness={0.6} />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

function Water({ onTap }) {
  const geometry = useMemo(() => new THREE.ShapeGeometry(blobShape(1.02), 48), [])
  const floor = useMemo(() => new THREE.ShapeGeometry(blobShape(0.82), 48), [])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={floor} position={[0, 0, -0.12]}>
        <meshStandardMaterial color="#4f8f84" roughness={0.9} />
      </mesh>
      <mesh
        geometry={geometry}
        position={[0, 0, -0.02]}
        receiveShadow
        onPointerDown={(event) => onTap(event.point.x, event.point.z)}
      >
        <meshStandardMaterial
          color="#8cc8bb"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.88}
          stencilWrite
          stencilRef={1}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>
    </group>
  )
}

function LilyPad({ x, z, size = 1, rotate = 0, delay = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    ref.current.position.y = -0.005 + Math.sin(state.clock.elapsedTime * 1.5 + delay) * 0.008
  })

  return (
    <group ref={ref} position={[x, 0, z]} rotation={[0, rotate, 0]} scale={size}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 40, 1, false, 0.25, Math.PI * 2 - 0.5]} />
        <meshStandardMaterial color="#6fae6c" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Ripple({ x, z, strong, born, now }) {
  const ref = useRef()
  useFrame(() => {
    const t = THREE.MathUtils.clamp((now.current - born) / RIPPLE_LIFE, 0, 1)
    const radius = 0.05 + t * (strong ? 0.9 : 0.5)
    ref.current.scale.set(radius, radius, 1)
    ref.current.material.opacity = Math.max(0, 1 - t) * (strong ? 0.8 : 0.5)
  })

  return (
    <mesh ref={ref} position={[x, -0.01, z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <ringGeometry args={[0.92, 1, 48]} />
      {/* only drawn where the water surface wrote the stencil, so ripples stay in the pond */}
      <meshBasicMaterial
        color="#ffffff"
        transparent
        depthWrite={false}
        stencilWrite
        stencilRef={1}
        stencilFunc={THREE.EqualStencilFunc}
      />
    </mesh>
  )
}

function PondScene({ leaves, rain }) {
  const [ripples, setRipples] = useState([])
  const nextId = useRef(0)
  const lastRain = useRef(0)
  // R3F resets clock.elapsedTime whenever the frameloop resumes (the pond pauses
  // offscreen), so ripples are timed against our own accumulated clock instead
  const now = useRef(0)
  const { camera, gl } = useThree()

  const addRipple = (x, z, strong) => {
    const id = nextId.current++
    const born = now.current
    setRipples((prev) => [
      ...prev.filter((r) => born - r.born < RIPPLE_LIFE),
      { id, x, z, strong, born },
    ])
  }

  useEffect(() => {
    // swimmable area in world XZ, inset from the bank so the frog never pokes over it
    // (shapes are drawn in XY, then laid flat with z = -y)
    const outline = blobShape(0.72).getPoints()
    const raycaster = new THREE.Raycaster()
    const surface = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

    const toWater = (clientX, clientY) => {
      const rect = gl.domElement.getBoundingClientRect()
      if (
        clientX < rect.left || clientX > rect.right ||
        clientY < rect.top || clientY > rect.bottom
      ) return null
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(ndc, camera)
      const hit = new THREE.Vector3()
      if (!raycaster.ray.intersectPlane(surface, hit)) return null
      return pointInPolygon(hit.x, -hit.z, outline) ? hit : null
    }

    return registerPond({
      rect: () => gl.domElement.getBoundingClientRect(),
      contains: (clientX, clientY) => toWater(clientX, clientY) !== null,
      splash: (clientX, clientY, strong = false) => {
        const hit = toWater(clientX, clientY)
        if (hit) addRipple(hit.x, hit.z, strong)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl])

  useFrame((_, delta) => {
    now.current += Math.min(delta, 0.1)
    if (!rain || now.current - lastRain.current < RAIN_INTERVAL) return
    lastRain.current = now.current
    const angle = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * 0.7
    addRipple(Math.cos(angle) * RADIUS_X * r, Math.sin(angle) * RADIUS_Z * r, false)
  })

  return (
    <>
      <Bank />
      <Water onTap={(x, z) => addRipple(x, z, true)} />
      {leaves.map((leaf, index) => (
        <LilyPad key={index} delay={index * 1.3} {...leaf} />
      ))}
      {ripples.map((ripple) => (
        <Ripple key={ripple.id} now={now} {...ripple} />
      ))}
    </>
  )
}

export default function Pond({ className = '', leaves = [] }) {
  const wrapperRef = useRef(null)
  const inView = useInView(wrapperRef, { margin: '100px' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={wrapperRef} className={`aspect-[2/1] ${className}`} role="img" aria-label="小さな池">
      <Canvas
        orthographic
        shadows
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
        className="cursor-pointer"
      >
        {/* same viewing angle and lights as Frog3D so the two read as one world */}
        <OrthographicCamera
          makeDefault
          position={[0, 8.5, 6]}
          near={0.1}
          far={40}
          onUpdate={(cam) => cam.lookAt(0, 0, 0)}
        />
        <CameraFit />
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[3, 6, 2]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.002}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        <PondScene leaves={leaves} rain={!reduceMotion} />
      </Canvas>
    </div>
  )
}
