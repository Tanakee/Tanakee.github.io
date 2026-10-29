import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── Water Shader ───────────────────────────────────────────────────────────
const WATER_VERT = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 2.1 + uTime * 0.7) * 0.04;
    pos.z += cos(pos.y * 1.8 + uTime * 0.55) * 0.03;
    pos.z += sin((pos.x - pos.y) * 1.4 + uTime * 0.38) * 0.025;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`
const WATER_FRAG = `
  uniform float uTime;
  uniform vec2 uRippleCenters[8];
  uniform float uRippleStarts[8];
  varying vec2 vUv;
  void main() {
    vec3 deep    = vec3(0.027, 0.18, 0.10);
    vec3 shallow = vec3(0.055, 0.30, 0.17);
    float w1 = sin(vUv.x * 18.0 + uTime * 0.60) * 0.5 + 0.5;
    float w2 = sin(vUv.y * 14.0 - uTime * 0.45) * 0.5 + 0.5;
    float w3 = sin((vUv.x + vUv.y) * 10.0 + uTime * 0.32) * 0.5 + 0.5;
    vec3 color = mix(deep, shallow, w1 * w2 * w3 * 0.65);
    float shimmer = pow(max(0.0, sin(vUv.x * 72.0 + uTime * 3.0) * sin(vUv.y * 68.0 - uTime * 2.5)), 5.0);
    color += vec3(0.30, 0.72, 0.50) * shimmer * 0.18;
    for (int i = 0; i < 8; i++) {
      float st = uRippleStarts[i];
      if (st > -1.0) {
        float age = uTime - st;
        if (age > 0.0 && age < 3.5) {
          float radius = age * 0.14;
          float dist   = length(vUv - uRippleCenters[i]);
          float w      = 0.013;
          float ring   = smoothstep(radius - w, radius, dist) - smoothstep(radius, radius + w, dist);
          color += vec3(0.20, 0.55, 0.35) * ring * (1.0 - age / 3.5) * 2.8;
        }
      }
    }
    vec2 centered = vUv - 0.5;
    color *= max(1.0 - length(centered) * 0.75, 0.38);
    float edgeFade = smoothstep(0.5, 0.18, length(centered));
    gl_FragColor = vec4(color, 0.94 * edgeFade);
  }
`

// ─── Rain Shader ─────────────────────────────────────────────────────────────
const RAIN_VERT = `
  attribute float aRandX;
  attribute float aRandZ;
  attribute float aPhase;
  attribute float aIsBottom;
  uniform float uTime;
  void main() {
    float speed = 9.5;
    float y = 8.0 - mod(aPhase + uTime * speed, 22.0);
    vec3 pos = vec3(aRandX, y - aIsBottom * 0.5, aRandZ);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`
const RAIN_FRAG = `
  void main() {
    gl_FragColor = vec4(0.62, 0.86, 1.0, 0.32);
  }
`

// ─── Water ───────────────────────────────────────────────────────────────────
function Water() {
  const rippleData = useRef({
    centers: Array(8).fill(null).map(() => new THREE.Vector2(0.5, 0.5)),
    starts: new Float32Array(8).fill(-999),
    next: 0,
    lastAdd: 0,
  })

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(30, 22, ...waterSegments)
    const material = new THREE.ShaderMaterial({
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uRippleCenters: { value: Array(8).fill(null).map(() => new THREE.Vector2(0.5, 0.5)) },
        uRippleStarts: { value: new Float32Array(8).fill(-999) },
      },
    })
    return { geometry, material }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    material.uniforms.uTime.value = t

    const d = rippleData.current
    if (t - d.lastAdd > 0.45 + Math.random() * 0.9) {
      d.lastAdd = t
      const idx = d.next % 8
      d.next++
      const wx = (Math.random() - 0.5) * 20
      const wz = (Math.random() - 0.5) * 14
      d.centers[idx].set(wx / 28 + 0.5, wz / 20 + 0.5)
      d.starts[idx] = t
      material.uniforms.uRippleCenters.value = d.centers
      material.uniforms.uRippleStarts.value = d.starts
    }
  })

  return <mesh geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} />
}

// ─── Rain ────────────────────────────────────────────────────────────────────
function Rain({ count = 1500 }) {
  const matRef = useRef()

  const { geometry } = useMemo(() => {
    const n = count * 2
    const positions = new Float32Array(n * 3)
    const aRandX    = new Float32Array(n)
    const aRandZ    = new Float32Array(n)
    const aPhase    = new Float32Array(n)
    const aIsBottom = new Float32Array(n)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 26
      const z = (Math.random() - 0.5) * 20
      const ph = Math.random() * 22
      const vi = i * 2
      positions[vi * 3] = x;     positions[vi * 3 + 1] = 0; positions[vi * 3 + 2] = z
      positions[(vi+1)*3] = x;   positions[(vi+1)*3+1] = -0.5; positions[(vi+1)*3+2] = z
      aRandX[vi] = x;    aRandX[vi+1] = x
      aRandZ[vi] = z;    aRandZ[vi+1] = z
      aPhase[vi] = ph;   aPhase[vi+1] = ph
      aIsBottom[vi] = 0; aIsBottom[vi+1] = 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aRandX',   new THREE.BufferAttribute(aRandX, 1))
    geometry.setAttribute('aRandZ',   new THREE.BufferAttribute(aRandZ, 1))
    geometry.setAttribute('aPhase',   new THREE.BufferAttribute(aPhase, 1))
    geometry.setAttribute('aIsBottom',new THREE.BufferAttribute(aIsBottom, 1))
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 40)
    return { geometry }
  }, [count])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: RAIN_VERT,
    fragmentShader: RAIN_FRAG,
    transparent: true,
    uniforms: { uTime: { value: 0 } },
  }), [])

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />
}

// ─── Lotus Leaf ──────────────────────────────────────────────────────────────
function LotusLeaf({ position, rotY = 0, scale = 1, rocking = 1 }) {
  const meshRef = useRef()
  const speed = useMemo(() => 0.18 + Math.random() * 0.14, [])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  const { geometry, material } = useMemo(() => {
    const notch = 0.22
    const shape = new THREE.Shape()
    const seg = 64
    shape.moveTo(Math.cos(notch), Math.sin(notch))
    for (let i = 1; i <= seg; i++) {
      const a = notch + (i / seg) * (Math.PI * 2 - notch * 2)
      shape.lineTo(Math.cos(a), Math.sin(a))
    }
    shape.lineTo(0, 0)
    shape.lineTo(Math.cos(notch), Math.sin(notch))
    return {
      geometry: new THREE.ShapeGeometry(shape, 32),
      material: new THREE.MeshToonMaterial({ color: '#2d7a4a', side: THREE.DoubleSide }),
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.rotation.z = Math.sin(t * speed + phase) * 0.022 * rocking
    meshRef.current.rotation.x = -Math.PI / 2 + Math.cos(t * speed * 0.7 + phase) * 0.012 * rocking
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} position={position} rotation={[-Math.PI / 2, 0, rotY]} scale={scale} />
}

// ─── Lotus Flower ────────────────────────────────────────────────────────────
function LotusFlower({ position }) {
  const group = useRef()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  const petalMat = useMemo(() => new THREE.MeshToonMaterial({ color: '#e87a9f' }), [])
  const petalMatAlt = useMemo(() => new THREE.MeshToonMaterial({ color: '#f2a8c2' }), [])
  const centerMat = useMemo(() => new THREE.MeshToonMaterial({ color: '#f5c842' }), [])
  const baseMat = useMemo(() => new THREE.MeshToonMaterial({ color: '#3d8f52', side: THREE.DoubleSide }), [])
  const petalGeo = useMemo(() => new THREE.SphereGeometry(1, 8, 8), [])
  const centerGeo = useMemo(() => new THREE.SphereGeometry(0.12, 8, 8), [])
  const baseGeo = useMemo(() => new THREE.CircleGeometry(0.45, 32), [])

  useFrame(({ clock }) => {
    group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.18 + phase) * 0.06
  })

  return (
    <group ref={group} position={position}>
      <mesh geometry={baseGeo} material={baseMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} />
      <mesh geometry={centerGeo} material={centerMat} position={[0, 0.06, 0]} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        const offset = i % 2 === 0 ? 0 : 0.08
        return (
          <mesh
            key={i}
            geometry={petalGeo}
            material={i % 2 === 0 ? petalMat : petalMatAlt}
            position={[Math.cos(a) * 0.22, offset, Math.sin(a) * 0.22]}
            rotation={[0.38, a, 0]}
            scale={[0.11, 0.21, 0.1]}
          />
        )
      })}
    </group>
  )
}

// ─── Frog ────────────────────────────────────────────────────────────────────
function Frog({ position }) {
  const group = useRef()
  const lEye = useRef()
  const rEye = useRef()
  const { clock } = useThree()
  const state = useRef({ nextBlink: 3, blinking: false })

  const mats = useMemo(() => ({
    body:  new THREE.MeshToonMaterial({ color: '#5dbb63' }),
    belly: new THREE.MeshToonMaterial({ color: '#a0d4a5' }),
    eye:   new THREE.MeshToonMaterial({ color: '#f0f090' }),
    pupil: new THREE.MeshToonMaterial({ color: '#111111' }),
    foot:  new THREE.MeshToonMaterial({ color: '#4aad6a' }),
  }), [])

  useFrame(() => {
    const t = clock.getElapsedTime()
    const s = state.current

    const breathe = Math.sin(t * 1.6) * 0.022
    group.current.position.y = position[1] + breathe
    group.current.scale.set(1, 1 + breathe * 0.5, 1)

    // Blink
    if (t > s.nextBlink) {
      s.blinking = true
      s.nextBlink = t + 3 + Math.random() * 4
    }
    if (s.blinking) {
      const bScale = Math.abs(Math.sin((t - (s.nextBlink - 0.18)) * 28)) * 0.85 + 0.15
      if (lEye.current) lEye.current.scale.y = bScale
      if (rEye.current) rEye.current.scale.y = bScale
      if (t > s.nextBlink - 0.08) s.blinking = false
    }
  })

  return (
    <group ref={group} position={position}>
      {/* Body */}
      <mesh material={mats.body} scale={[1.25, 0.75, 1.1]}>
        <sphereGeometry args={[0.44, 16, 16]} />
      </mesh>
      {/* Belly */}
      <mesh material={mats.belly} position={[0, -0.06, 0.38]} scale={[0.72, 0.58, 0.28]}>
        <sphereGeometry args={[0.44, 12, 12]} />
      </mesh>
      {/* Head */}
      <mesh material={mats.body} position={[0, 0.19, 0.32]} scale={[1, 0.88, 1]}>
        <sphereGeometry args={[0.31, 16, 16]} />
      </mesh>
      {/* Eye L */}
      <group ref={lEye} position={[-0.145, 0.4, 0.4]}>
        <mesh material={mats.eye}><sphereGeometry args={[0.105, 10, 10]} /></mesh>
        <mesh material={mats.pupil} position={[0, 0, 0.075]}>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
      </group>
      {/* Eye R */}
      <group ref={rEye} position={[0.145, 0.4, 0.4]}>
        <mesh material={mats.eye}><sphereGeometry args={[0.105, 10, 10]} /></mesh>
        <mesh material={mats.pupil} position={[0, 0, 0.075]}>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
      </group>
      {/* Feet */}
      <mesh material={mats.foot} position={[-0.38, -0.3, 0.28]} scale={[0.44, 0.22, 0.58]}>
        <sphereGeometry args={[0.3, 10, 10]} />
      </mesh>
      <mesh material={mats.foot} position={[0.38, -0.3, 0.28]} scale={[0.44, 0.22, 0.58]}>
        <sphereGeometry args={[0.3, 10, 10]} />
      </mesh>
    </group>
  )
}

// ─── Firefly ─────────────────────────────────────────────────────────────────
function Firefly({ position }) {
  const lightRef = useRef()
  const meshRef = useRef()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const speed = useMemo(() => 0.3 + Math.random() * 0.3, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const x = position[0] + Math.sin(t * speed + phase) * 0.6
    const y = position[1] + Math.sin(t * speed * 1.3 + phase) * 0.4
    const z = position[2] + Math.cos(t * speed * 0.8 + phase) * 0.5
    lightRef.current.position.set(x, y, z)
    meshRef.current.position.set(x, y, z)
    const flicker = 0.5 + Math.abs(Math.sin(t * 3.5 + phase)) * 0.5
    lightRef.current.intensity = flicker * 1.2
    meshRef.current.material.emissiveIntensity = flicker * 4
  })

  return (
    <>
      <pointLight ref={lightRef} position={position} color="#d4ff88" distance={3} intensity={0.8} />
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshStandardMaterial color="#d4ff88" emissive="#d4ff88" emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </>
  )
}

// ─── Camera (mouse parallax) ─────────────────────────────────────────────────
function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.9, 0.025)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3 + mouse.current.y * 0.45, 0.025)
    camera.lookAt(0, -1.2, 0)
  })

  return null
}

// ─── Scene Composition ───────────────────────────────────────────────────────
function Scene({ rainCount, isLowEnd }) {
  return (
    <>
      <Water />
      <Rain count={rainCount} />

      {/* Main leaf with frog — right side so frog isn't behind title text */}
      <LotusLeaf position={[3.2, -1.35, 1.5]} scale={1.9} rocking={1} />
      <Frog position={[3.2, -0.8, 1.5]} />

      {/* Secondary leaves */}
      <LotusLeaf position={[-3.6, -1.4, -1.5]} rotY={0.9}  scale={1.45} rocking={1.2} />
      <LotusLeaf position={[-0.5, -1.4, -0.8]} rotY={-0.3} scale={1.3}  rocking={0.9} />
      <LotusLeaf position={[-2.2, -1.4, 2.2]}  rotY={1.3}  scale={1.15} rocking={1.4} />
      <LotusLeaf position={[5.2,  -1.45, -1.0]} rotY={-1.2} scale={1.05} rocking={0.8} />
      <LotusLeaf position={[1.0,  -1.42, -3.2]} rotY={0.4}  scale={1.0}  rocking={1.1} />

      {/* Lotus flowers */}
      <LotusFlower position={[-3.6, -1.28, -1.5]} />
      <LotusFlower position={[-0.5, -1.3,  -0.8]} />

      {/* Fireflies */}
      <Firefly position={[-2, 0.5, 1]} />
      {!isLowEnd && <Firefly position={[2.5, 0.8, -1]} />}
      {!isLowEnd && <Firefly position={[0.5, 1.2, -2]} />}

      <CameraController />
    </>
  )
}

// ─── Performance tier ────────────────────────────────────────────────────────
const cores = navigator.hardwareConcurrency ?? 4
const isLowEnd = cores <= 4
const rainCount = isLowEnd ? 300 : 600
const waterSegments = isLowEnd ? [32, 24] : [48, 36]
const maxDpr = isLowEnd ? 1 : 1.5

// ─── Export ──────────────────────────────────────────────────────────────────
export default function FrogScene() {
  return (
    <Canvas camera={{ position: [0, 3, 10], fov: 60 }} dpr={Math.min(window.devicePixelRatio, maxDpr)} style={{ background: '#071e13' }}>
      <fogExp2 attach="fog" args={['#071e13', 0.04]} />
      <ambientLight intensity={0.28} color="#4a8a6a" />
      <directionalLight position={[4, 10, 3]} intensity={0.65} color="#b8f0d0" />
      <pointLight position={[-5, 3, -4]} intensity={1.2} color="#e87a9f" distance={10} />
      <pointLight position={[5,  2, -4]} intensity={0.8} color="#d4b8f0" distance={8} />
      <Scene rainCount={rainCount} isLowEnd={isLowEnd} />
      {!isLowEnd && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.6}
            intensity={0.9}
            height={300}
          />
          <Vignette offset={0.18} darkness={0.72} />
        </EffectComposer>
      )}
      {isLowEnd && (
        <EffectComposer>
          <Vignette offset={0.18} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
