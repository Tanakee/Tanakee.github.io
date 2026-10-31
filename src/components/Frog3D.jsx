import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import { findPondAt } from './pondRegistry.js'

const GREEN = '#5cb567'
const GREEN_SHADE = '#4a9a55'
const ZOOM = 100
const IDLE_HOP_RANGE = 1.2
const FROG_SCALE = 0.6
const SINK_DEPTH = 0.32
const SWIM_SPEED = 90
const WAKE_INTERVAL = 0.35

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t)
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function FootNub({ x, z }) {
  return (
    <mesh position={[x, 0.09, z]} castShadow>
      <sphereGeometry args={[0.1, 14, 14]} />
      <meshStandardMaterial color={GREEN_SHADE} roughness={0.6} />
    </mesh>
  )
}

function FrogBody() {
  const eyeLRef = useRef()
  const eyeRRef = useRef()

  useFrame((state) => {
    const cycle = state.clock.elapsedTime % 4.5
    const isBlinking = cycle > 4.3
    const scaleY = isBlinking ? 0.08 : 1
    if (eyeLRef.current) eyeLRef.current.scale.y = THREE.MathUtils.lerp(eyeLRef.current.scale.y, scaleY, 0.6)
    if (eyeRRef.current) eyeRRef.current.scale.y = THREE.MathUtils.lerp(eyeRRef.current.scale.y, scaleY, 0.6)
  })

  const smileCurve = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.12, 0, 0),
      new THREE.Vector3(0, -0.05, 0),
      new THREE.Vector3(0.12, 0, 0),
    )
    return new THREE.TubeGeometry(curve, 16, 0.013, 6, false)
  }, [])

  return (
    <group>
      {/* small round body, mostly tucked behind the head */}
      <mesh position={[0, 0.22, -0.28]} scale={[0.92, 0.72, 0.85]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={GREEN} roughness={0.55} />
      </mesh>

      {/* big round head — dominant, chibi proportions */}
      <mesh position={[0, 0.5, 0.05]} scale={[1, 0.92, 0.95]} castShadow>
        <sphereGeometry args={[0.56, 32, 32]} />
        <meshStandardMaterial color={GREEN} roughness={0.5} />
      </mesh>

      {/* pale belly patch */}
      <mesh position={[0, 0.12, 0.22]} scale={[0.6, 0.35, 0.5]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color="#eef7e8" roughness={0.65} />
      </mesh>

      {/* mouth */}
      <mesh geometry={smileCurve} position={[0, 0.42, 0.58]}>
        <meshStandardMaterial color="#1c261f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.46, 0.6]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#1c261f" roughness={0.5} />
      </mesh>

      {/* big round eyes on top of the head */}
      {[-0.26, 0.26].map((x) => (
        <group key={x} position={[x, 0.9, 0.18]}>
          <mesh castShadow>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color={GREEN} roughness={0.5} />
          </mesh>
          <mesh ref={x < 0 ? eyeLRef : eyeRRef} position={[0, 0.07, 0.2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#1c261f" roughness={0.25} />
          </mesh>
          <mesh position={[0.045, 0.12, 0.3]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* tiny stub legs, barely poking out */}
      <FootNub x={-0.52} z={0.05} />
      <FootNub x={0.52} z={0.05} />
      <FootNub x={-0.42} z={-0.48} />
      <FootNub x={0.42} z={-0.48} />
    </group>
  )
}

function useWaterlineTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(128, 184, 172, 1)')
    gradient.addColorStop(0.5, 'rgba(128, 184, 172, 1)')
    gradient.addColorStop(0.58, 'rgba(232, 246, 241, 0.7)')
    gradient.addColorStop(0.64, 'rgba(128, 184, 172, 0.5)')
    gradient.addColorStop(0.8, 'rgba(128, 184, 172, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

function HoppingFrog() {
  const groupRef = useRef()
  const shadowRef = useRef()
  const waterlineRef = useRef()
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const start = useRef(new THREE.Vector3(0, 0, 0))
  const progress = useRef(1)
  const idleTimer = useRef(0)
  const sink = useRef(0)

  // while in a pond the frog's position is kept relative to the pond's on-screen
  // rect, so it stays in the water when the page scrolls
  const pond = useRef(null)
  const anchor = useRef({ x: 0, y: 0 })
  const swimFrom = useRef({ x: 0, y: 0 })
  const swimTo = useRef({ x: 0, y: 0 })
  const swimProgress = useRef(1)
  const swimDuration = useRef(1)
  const wakeTimer = useRef(0)

  const { camera, size, gl } = useThree()
  const waterlineTexture = useWaterlineTexture()

  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])

  useEffect(() => {
    // anything below the water surface (y < 0) is hidden while swimming
    gl.localClippingEnabled = true
    groupRef.current.traverse((object) => {
      if (!object.material) return
      object.material.clippingPlanes = [groundPlane]
      object.material.needsUpdate = true
    })
  }, [gl, groundPlane])

  const screenToGround = (clientX, clientY) => {
    const ndc = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    )
    raycaster.setFromCamera(ndc, camera)
    const hit = new THREE.Vector3()
    return raycaster.ray.intersectPlane(groundPlane, hit) ? hit : null
  }

  const groundToScreen = (point) => {
    const ndc = new THREE.Vector3(point.x, 0, point.z).project(camera)
    return {
      x: ((ndc.x + 1) / 2) * window.innerWidth,
      y: ((1 - ndc.y) / 2) * window.innerHeight,
    }
  }

  const frogScreen = () => {
    const rect = pond.current.rect()
    return { x: rect.left + anchor.current.x, y: rect.top + anchor.current.y }
  }

  const pickNewTarget = (point) => {
    if (pond.current) {
      const from = frogScreen()
      pond.current.splash(from.x, from.y, true)
      pond.current = null
    }
    start.current.copy(groupRef.current.position)
    const limitX = size.width / ZOOM / 2 - 0.7
    const limitZ = size.height / ZOOM / 2 - 0.7
    const p = point
      ? point.clone()
      : new THREE.Vector3(
          start.current.x + THREE.MathUtils.randFloatSpread(IDLE_HOP_RANGE * 2),
          0,
          start.current.z + THREE.MathUtils.randFloatSpread(IDLE_HOP_RANGE * 2),
        )
    p.x = THREE.MathUtils.clamp(p.x, -limitX, limitX)
    p.z = THREE.MathUtils.clamp(p.z, -limitZ, limitZ)
    p.y = 0
    target.current.copy(p)
    progress.current = 0
  }

  const enterPond = (nextPond, screen) => {
    const rect = nextPond.rect()
    pond.current = nextPond
    anchor.current = { x: screen.x - rect.left, y: screen.y - rect.top }
    swimProgress.current = 1
    nextPond.splash(screen.x, screen.y, true)
  }

  const swimTowards = (clientX, clientY) => {
    const rect = pond.current.rect()
    swimFrom.current = { ...anchor.current }
    swimTo.current = { x: clientX - rect.left, y: clientY - rect.top }
    const distance = Math.hypot(
      swimTo.current.x - swimFrom.current.x,
      swimTo.current.y - swimFrom.current.y,
    )
    swimDuration.current = THREE.MathUtils.clamp(distance / SWIM_SPEED, 0.6, 3)
    swimProgress.current = 0
  }

  const pickSwimTarget = () => {
    const rect = pond.current.rect()
    for (let i = 0; i < 12; i++) {
      const x = rect.left + anchor.current.x + THREE.MathUtils.randFloatSpread(rect.width * 0.6)
      const y = rect.top + anchor.current.y + THREE.MathUtils.randFloatSpread(rect.height * 0.6)
      if (pond.current.contains(x, y)) {
        swimTowards(x, y)
        return
      }
    }
  }

  useEffect(() => {
    const onClick = (event) => {
      idleTimer.current = 0
      if (pond.current && findPondAt(event.clientX, event.clientY) === pond.current) {
        swimTowards(event.clientX, event.clientY)
        return
      }
      const hit = screenToGround(event.clientX, event.clientY)
      if (hit) pickNewTarget(hit)
    }
    window.addEventListener('pointerdown', onClick)
    return () => window.removeEventListener('pointerdown', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  const faceTowards = (dx, dz) => {
    if (Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.atan2(dx, dz),
      0.3,
    )
  }

  useFrame((state, delta) => {
    const group = groupRef.current
    const shadow = shadowRef.current
    const waterline = waterlineRef.current
    if (!group || !shadow || !waterline) return

    let heightFactor = 0
    let baseY = 0

    if (pond.current) {
      const rect = pond.current.rect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        // the pond scrolled away: hop back into view
        pickNewTarget(screenToGround(window.innerWidth / 2, window.innerHeight / 2))
      }
    }

    if (pond.current) {
      idleTimer.current += delta
      if (swimProgress.current < 1) {
        swimProgress.current = Math.min(1, swimProgress.current + delta / swimDuration.current)
        const eased = easeInOutSine(swimProgress.current)
        anchor.current = {
          x: THREE.MathUtils.lerp(swimFrom.current.x, swimTo.current.x, eased),
          y: THREE.MathUtils.lerp(swimFrom.current.y, swimTo.current.y, eased),
        }
        wakeTimer.current += delta
        if (wakeTimer.current > WAKE_INTERVAL) {
          wakeTimer.current = 0
          const screen = frogScreen()
          pond.current.splash(screen.x, screen.y)
        }
        idleTimer.current = 0
      } else if (idleTimer.current > 2.4) {
        idleTimer.current = 0
        if (Math.random() < 0.25) pickNewTarget()
        else pickSwimTarget()
      }
    }

    if (pond.current) {
      const screen = frogScreen()
      const ground = screenToGround(screen.x, screen.y)
      if (ground) {
        faceTowards(ground.x - group.position.x, ground.z - group.position.z)
        group.position.x = ground.x
        group.position.z = ground.z
      }
      sink.current = THREE.MathUtils.lerp(sink.current, 1, 0.12)
      baseY = Math.sin(state.clock.elapsedTime * 3) * 0.008
      group.scale.set(1, 1, 1)
    } else if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 1.6)
      const eased = easeOutQuad(progress.current)
      group.position.x = THREE.MathUtils.lerp(start.current.x, target.current.x, eased)
      group.position.z = THREE.MathUtils.lerp(start.current.z, target.current.z, eased)
      heightFactor = Math.sin(progress.current * Math.PI)
      baseY = heightFactor * 0.85 * FROG_SCALE

      const squash = 1 - heightFactor * 0.25
      group.scale.set(1 / squash, squash, 1 / squash)
      faceTowards(target.current.x - start.current.x, target.current.z - start.current.z)
      sink.current = THREE.MathUtils.lerp(sink.current, 0, 0.2)

      if (progress.current === 1) {
        const landing = groundToScreen(target.current)
        const landedPond = findPondAt(landing.x, landing.y)
        if (landedPond) enterPond(landedPond, landing)
      }
    } else {
      group.scale.set(
        THREE.MathUtils.lerp(group.scale.x, 1, 0.2),
        THREE.MathUtils.lerp(group.scale.y, 1, 0.2),
        THREE.MathUtils.lerp(group.scale.z, 1, 0.2),
      )
      sink.current = THREE.MathUtils.lerp(sink.current, 0, 0.2)
      idleTimer.current += delta

      // the frog is fixed to the viewport while ponds scroll with the page, so a pond
      // can slide in under a resting frog; drop it into the water when that happens
      const screen = groundToScreen(group.position)
      const underfoot = findPondAt(screen.x, screen.y)
      if (underfoot) {
        enterPond(underfoot, screen)
        idleTimer.current = 0
      } else if (idleTimer.current > 3.2) {
        pickNewTarget()
        idleTimer.current = 0
      }
    }

    group.position.y = THREE.MathUtils.lerp(
      group.position.y,
      baseY - sink.current * SINK_DEPTH,
      progress.current < 1 ? 1 : 0.3,
    )

    shadow.position.x = group.position.x + (0.18 + heightFactor * 0.14) * FROG_SCALE
    shadow.position.z = group.position.z + (0.14 + heightFactor * 0.1) * FROG_SCALE
    const shrink = 1 - heightFactor * 0.3
    shadow.scale.set(shrink, shrink, 1)
    shadow.material.opacity = (0.42 - heightFactor * 0.15) * (1 - sink.current)

    waterline.position.x = group.position.x
    waterline.position.z = group.position.z
    waterline.material.opacity = sink.current
  })

  return (
    <>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.6 * FROG_SCALE, 32]} />
        <meshBasicMaterial color="#16241a" transparent opacity={0.42} depthWrite={false} />
      </mesh>
      {/* covers the clipped opening at the water surface while swimming */}
      <mesh ref={waterlineRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.75 * FROG_SCALE, 40]} />
        <meshBasicMaterial map={waterlineTexture} transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={groupRef} position={[0, 0, 0]}>
        <group scale={FROG_SCALE}>
          <FrogBody />
        </group>
      </group>
    </>
  )
}

export default function Frog3D({ className = '' }) {
  return (
    <div className={className}>
      <Canvas
        orthographic
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        // R3F sets pointer-events: auto on its own wrapper, which would swallow every
        // click on the page; the frog listens on window instead
        style={{ pointerEvents: 'none' }}
      >
        <OrthographicCamera
          makeDefault
          position={[0, 8.5, 6]}
          zoom={ZOOM}
          near={0.1}
          far={40}
          onUpdate={(cam) => cam.lookAt(0, 0.2, 0)}
        />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 6, 2]} intensity={1.1} />

        <HoppingFrog />
      </Canvas>
    </div>
  )
}
