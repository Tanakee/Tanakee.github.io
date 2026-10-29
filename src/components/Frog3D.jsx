import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'

const GREEN = '#5cb567'
const GREEN_SHADE = '#4a9a55'
const ZOOM = 100
const IDLE_HOP_RANGE = 1.2
const FROG_SCALE = 0.6

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t)
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

function HoppingFrog() {
  const groupRef = useRef()
  const shadowRef = useRef()
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const start = useRef(new THREE.Vector3(0, 0, 0))
  const progress = useRef(1)
  const idleTimer = useRef(0)
  const { camera, size } = useThree()

  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])

  const pickNewTarget = (point) => {
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

  useEffect(() => {
    const onClick = (event) => {
      const ndc = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      )
      raycaster.setFromCamera(ndc, camera)
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(groundPlane, hit)) {
        pickNewTarget(hit)
        idleTimer.current = 0
      }
    }
    window.addEventListener('pointerdown', onClick)
    return () => window.removeEventListener('pointerdown', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  useFrame((state, delta) => {
    const group = groupRef.current
    const shadow = shadowRef.current
    if (!group || !shadow) return

    let heightFactor = 0

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 1.6)
      const eased = easeOutQuad(progress.current)
      group.position.x = THREE.MathUtils.lerp(start.current.x, target.current.x, eased)
      group.position.z = THREE.MathUtils.lerp(start.current.z, target.current.z, eased)
      heightFactor = Math.sin(progress.current * Math.PI)
      group.position.y = heightFactor * 0.85 * FROG_SCALE

      const squash = 1 - heightFactor * 0.25
      group.scale.set(1 / squash, squash, 1 / squash)

      const dx = target.current.x - start.current.x
      const dz = target.current.z - start.current.z
      if (Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001) {
        const angle = Math.atan2(dx, dz)
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, angle, 0.3)
      }
    } else {
      group.position.y = THREE.MathUtils.lerp(group.position.y, 0, 0.3)
      group.scale.set(
        THREE.MathUtils.lerp(group.scale.x, 1, 0.2),
        THREE.MathUtils.lerp(group.scale.y, 1, 0.2),
        THREE.MathUtils.lerp(group.scale.z, 1, 0.2),
      )
      idleTimer.current += delta
      if (idleTimer.current > 3.2) {
        pickNewTarget()
        idleTimer.current = 0
      }
    }

    shadow.position.x = group.position.x + (0.18 + heightFactor * 0.14) * FROG_SCALE
    shadow.position.z = group.position.z + (0.14 + heightFactor * 0.1) * FROG_SCALE
    const shrink = 1 - heightFactor * 0.3
    shadow.scale.set(shrink, shrink, 1)
    shadow.material.opacity = 0.42 - heightFactor * 0.15
  })

  return (
    <>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.6 * FROG_SCALE, 32]} />
        <meshBasicMaterial color="#16241a" transparent opacity={0.42} depthWrite={false} />
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
