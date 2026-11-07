import { Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, RoundedBox } from '@react-three/drei'
import { Bloom, EffectComposer, N8AO, SMAA, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Note } from '../lib/notes'
import { FloorMaterial, MetalMaterial, WallMaterial, WoodMaterial } from './surfaces'
import { boardTexture, clockTexture, crisisScreen, laptopScreen, noteTexture, phoneScreen } from './textures'

type SceneProps = {
  entered: boolean
  laptopTitle: string
  laptopStack: string
  notes: Note[]
  onPick: (id: string) => void
  onHover: (id: string | null) => void
  onMiss: () => void
}

export function RoomScene(props: SceneProps) {
  const webgl2 = useMemo(() => {
    try {
      const canvas = document.createElement('canvas')
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      return false
    }
  }, [])

  if (!webgl2) return null

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.15, 1.55, 4.2], fov: 38 }}
      gl={{
        antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onPointerMissed={props.onMiss}
    >
      <color attach="background" args={['#090807']} />
      <Lights entered={props.entered} />
      <Suspense fallback={null}>
        <Environment files="/hdr/studio.hdr" environmentIntensity={0.16} />
        <Room {...props} />
      </Suspense>
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={14} blur={2.2} far={4.5} />
      <OrbitControls
        makeDefault
        target={[0.05, 1.05, -0.75]}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.85}
        zoomSpeed={0.65}
        minDistance={2.15}
        maxDistance={6.4}
        minPolarAngle={0.62}
        maxPolarAngle={1.32}
        minAzimuthAngle={-1.55}
        maxAzimuthAngle={1.55}
      />
      <EffectComposer multisampling={0} enableNormalPass>
        <N8AO aoRadius={0.45} intensity={1.6} distanceFalloff={0.6} quality="medium" />
        <Bloom intensity={0.22} luminanceThreshold={0.82} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.62} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  )
}

function Lights({ entered }: { entered: boolean }) {
  const lamp = useRef<THREE.PointLight>(null)
  const screen = useRef<THREE.PointLight>(null)
  const fill = useRef<THREE.AmbientLight>(null)
  const level = useRef(0)

  useFrame((_, delta) => {
    const target = entered ? 1 : 0
    level.current += (target - level.current) * Math.min(1, delta * 0.7)
    const t = level.current
    if (lamp.current) lamp.current.intensity = t * 9
    if (screen.current) screen.current.intensity = 0.6 + t * 3.2
    if (fill.current) fill.current.intensity = 0.03 + t * 0.08
  })

  return (
    <>
      <ambientLight ref={fill} intensity={0.08} />
      <hemisphereLight args={['#b9c7d6', '#3a2a22', 0.18]} />
      <directionalLight
        position={[-2.8, 3.2, 1.4]}
        intensity={entered ? 1.15 : 0.02}
        color={'#d5e4f5'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0003}
      />
      <pointLight
        ref={lamp}
        position={[-1.15, 1.55, -1.15]}
        color={'#ffc48a'}
        intensity={0}
        distance={6.5}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight ref={screen} position={[0.05, 1.4, -0.85]} color={'#9ecbff'} intensity={1.2} distance={3.2} decay={2} />
      <pointLight position={[-2.15, 1.55, -1.7]} color={'#9eb6d4'} intensity={entered ? 2.2 : 0.15} distance={4} decay={2} />
    </>
  )
}

function Room(props: SceneProps) {
  return (
    <group>
      <Architecture />
      <Desk />
      <Hit id="monitor" {...props}>
        <Monitor />
      </Hit>
      <Hit id="laptop" {...props}>
        <Laptop title={props.laptopTitle} stack={props.laptopStack} />
      </Hit>
      <Hit id="notebook" {...props}>
        <Notebook />
      </Hit>
      <Hit id="phone" {...props}>
        <Phone />
      </Hit>
      <Hit id="mug" {...props}>
        <Mug />
      </Hit>
      <Hit id="lamp" {...props}>
        <Lamp />
      </Hit>
      <Hit id="board" {...props}>
        <Whiteboard />
      </Hit>
      <Hit id="window" {...props}>
        <Window />
      </Hit>
      <Hit id="paper" {...props}>
        <Paper />
      </Hit>
      <Notes notes={props.notes} onPick={props.onPick} onHover={props.onHover} />
      <Hit id="write" {...props}>
        <NoteCard
          text="Leave one of your own."
          paper="#f7f1e4"
          position={[1.62, 2.22, -2.2]}
          rotation={[0, 0, -0.04]}
        />
      </Hit>
    </group>
  )
}

function Hit({
  id,
  onPick,
  onHover,
  children,
}: {
  id: string
  onPick: (id: string) => void
  onHover: (id: string | null) => void
  children: ReactNode
}) {
  const down = useRef({ x: 0, y: 0 })
  return (
    <group
      onPointerDown={(event) => {
        down.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={(event) => {
        const dx = event.clientX - down.current.x
        const dy = event.clientY - down.current.y
        if (dx * dx + dy * dy < 25) onPick(id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = ''
      }}
    >
      {children}
    </group>
  )
}

function Architecture() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[6.6, 4.7, 24, 24]} />
        <FloorMaterial />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0.012, -0.35]} receiveShadow>
        <planeGeometry args={[2.3, 1.7]} />
        <meshPhysicalMaterial color={'#6a2c28'} roughness={0.92} metalness={0} envMapIntensity={0.15} />
      </mesh>
      <Wall position={[0, 1.45, -2.28]} args={[6.6, 2.9, 0.08]} />
      <Wall position={[-3.26, 1.45, 0]} args={[0.08, 2.9, 4.7]} />
      <Wall position={[3.26, 1.45, 0]} args={[0.08, 2.9, 4.7]} />
      <mesh position={[0, 2.88, 0]}>
        <boxGeometry args={[6.6, 0.08, 4.7]} />
        <WallMaterial />
      </mesh>
      <Clock />
      <Plant />
    </group>
  )
}

function Wall({ position, args }: { position: [number, number, number]; args: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={args} />
      <WallMaterial />
    </mesh>
  )
}

function Desk() {
  return (
    <group position={[0.05, 0, -1.25]}>
      <RoundedBox args={[2.35, 0.07, 0.92]} radius={0.015} smoothness={4} position={[0, 0.74, 0]} castShadow receiveShadow>
        <WoodMaterial />
      </RoundedBox>
      {[
        [-1.05, 0.36, -0.36],
        [1.05, 0.36, -0.36],
        [-1.05, 0.36, 0.36],
        [1.05, 0.36, 0.36],
      ].map((position) => (
        <mesh key={position.join(',')} position={position as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <WoodMaterial color={'#c4a484'} />
        </mesh>
      ))}
      {[
        [-0.16, 0.2, 1.16],
        [0.26, 0.2, 1.16],
        [-0.16, 0.2, 1.54],
        [0.26, 0.2, 1.54],
      ].map((position) => (
        <mesh key={`chair-${position.join(',')}`} position={position as [number, number, number]} castShadow>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <WoodMaterial color={'#b08968'} />
        </mesh>
      ))}
      <mesh position={[0.05, 0.42, 1.35]} castShadow>
        <boxGeometry args={[0.48, 0.05, 0.46]} />
        <WoodMaterial color={'#c4a484'} />
      </mesh>
      <mesh position={[0.05, 0.62, 1.12]} castShadow>
        <boxGeometry args={[0.48, 0.32, 0.05]} />
        <WoodMaterial color={'#c4a484'} />
      </mesh>
      <mesh position={[-1.35, 0.28, 0.15]} castShadow>
        <boxGeometry args={[0.28, 0.56, 0.48]} />
        <MetalMaterial />
      </mesh>
      <mesh position={[-1.28, 0.18, 0.4]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color={'#7dcea0'} emissive={'#1f8a4c'} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function Monitor() {
  const texture = useMemo(() => crisisScreen(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group position={[-0.28, 0.78, -1.42]}>
      <RoundedBox args={[0.92, 0.56, 0.045]} radius={0.012} smoothness={4} position={[0, 0.42, 0]} castShadow>
        <MetalMaterial color={'#14161a'} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0.42, 0.025]}>
        <planeGeometry args={[0.84, 0.48]} />
        <meshStandardMaterial map={texture} emissive={'#9fd4ff'} emissiveIntensity={0.35} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.06, 0.16, 0.06]} />
        <MetalMaterial color={'#121316'} roughness={0.35} />
      </mesh>
    </group>
  )
}

function Laptop({ title, stack }: { title: string; stack: string }) {
  const texture = useMemo(() => laptopScreen(title, stack), [title, stack])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group position={[0.72, 0.78, -1.15]}>
      <mesh castShadow>
        <boxGeometry args={[0.46, 0.02, 0.32]} />
        <MetalMaterial color={'#2a3038'} roughness={0.32} />
      </mesh>
      <group position={[0, 0.01, -0.15]} rotation={[-1.15, 0, 0]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.46, 0.32, 0.02]} />
          <MetalMaterial color={'#1c2128'} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.16, 0.012]}>
          <planeGeometry args={[0.4, 0.24]} />
          <meshStandardMaterial map={texture} emissive={'#c6f6b0'} emissiveIntensity={0.25} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Notebook() {
  return (
    <group position={[-0.95, 0.8, -1.12]} rotation={[0, 0.3, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.025, 0.42]} />
        <meshStandardMaterial color={'#6e2a24'} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.016, 0]}>
        <boxGeometry args={[0.28, 0.008, 0.38]} />
        <meshStandardMaterial color={'#efe6d4'} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Phone() {
  const texture = useMemo(() => phoneScreen(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group position={[1.05, 0.79, -1.45]} rotation={[0, -0.4, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.16, 0.012, 0.3]} />
        <MetalMaterial color={'#0e1014'} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.13, 0.26]} />
        <meshStandardMaterial map={texture} emissive={'#d7e7f5'} emissiveIntensity={0.2} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Mug() {
  return (
    <group position={[-1.15, 0.82, -0.95]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.09, 20]} />
        <meshStandardMaterial color={'#d8d2c8'} roughness={0.4} />
      </mesh>
      <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color={'#d8d2c8'} />
      </mesh>
    </group>
  )
}

function Lamp() {
  return (
    <group position={[-1.15, 0.78, -1.45]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.03, 20]} />
        <meshStandardMaterial color={'#c9b49a'} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.48, 8]} />
        <meshStandardMaterial color={'#2b241c'} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <coneGeometry args={[0.16, 0.16, 20, 1, true]} />
        <meshStandardMaterial color={'#f3e2c4'} side={THREE.DoubleSide} emissive={'#ffb36b'} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={'#fff1d2'} emissive={'#ffd7a1'} emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Whiteboard() {
  const texture = useMemo(() => boardTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group position={[1.45, 1.48, -2.2]}>
      <mesh>
        <boxGeometry args={[1.05, 0.7, 0.03]} />
        <meshStandardMaterial color={'#cfc8be'} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.96, 0.6]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Window() {
  const material = useRef<THREE.ShaderMaterial>(null)
  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta
  })
  return (
    <group position={[-2.25, 1.28, -2.2]} scale={0.82}>
      <mesh>
        <boxGeometry args={[1.35, 1.7, 0.06]} />
        <WoodMaterial color={'#8a6a4a'} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[0.035, 1.46, 0.02]} />
        <meshStandardMaterial color={'#1a1612'} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[1.12, 0.035, 0.02]} />
        <meshStandardMaterial color={'#1a1612'} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.12, 1.46]} />
        <shaderMaterial
          ref={material}
          transparent
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            precision highp float;
            uniform float uTime;
            varying vec2 vUv;
            float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            void main() {
              float col = floor(vUv.x * 6.0);
              float height = 0.22 + hash(vec2(col, 2.0)) * 0.62;
              float building = step(vUv.y, height) * step(0.08, fract(vUv.x * 6.0));
              vec3 color = mix(vec3(0.01, 0.015, 0.03), vec3(0.035, 0.04, 0.055), building);
              vec2 cell = floor(vUv * vec2(18.0, 12.0));
              float windowLit = step(0.72, hash(cell));
              windowLit *= step(0.22, fract(vUv.x * 18.0)) * step(0.25, fract(vUv.y * 12.0));
              windowLit *= step(vUv.y + 0.02, height);
              color += vec3(1.0, 0.74, 0.38) * windowLit * 0.9;
              float rain = 0.0;
              for (int i = 0; i < 10; i++) {
                float fi = float(i);
                float x = fract(sin(fi * 91.7) * 47.3);
                float y = fract(vUv.y - uTime * (0.18 + fi * 0.025) + fi * 0.37);
                float streak = smoothstep(0.0035, 0.0, abs(vUv.x - x));
                float drop = smoothstep(0.0, 0.04, y) * smoothstep(0.28, 0.06, y);
                rain += streak * drop;
              }
              color += vec3(0.82, 0.9, 1.0) * rain;
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
    </group>
  )
}

function Paper() {
  return (
    <group position={[-0.9, 0.021, -0.15]} rotation={[-Math.PI / 2, 0, -0.15]}>
      <mesh receiveShadow>
        <planeGeometry args={[0.42, 0.56]} />
        <meshStandardMaterial color={'#f3efe4'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.04, 0.002]}>
        <planeGeometry args={[0.3, 0.012]} />
        <meshStandardMaterial color={'#1c1814'} />
      </mesh>
      <mesh position={[0, -0.02, 0.002]}>
        <planeGeometry args={[0.3, 0.008]} />
        <meshStandardMaterial color={'#8a8175'} />
      </mesh>
      <mesh position={[0, -0.06, 0.002]}>
        <planeGeometry args={[0.22, 0.008]} />
        <meshStandardMaterial color={'#8a8175'} />
      </mesh>
    </group>
  )
}

function Clock() {
  const texture = useMemo(() => clockTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <mesh position={[-2.25, 2.22, -2.22]}>
      <planeGeometry args={[0.7, 0.34]} />
      <meshStandardMaterial map={texture} emissive={'#ffb36b'} emissiveIntensity={0.25} />
    </mesh>
  )
}

function Plant() {
  return (
    <group position={[-2.7, 0, 1.35]}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.24, 12]} />
        <meshStandardMaterial color={'#6a3a28'} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={'#1f4a32'} roughness={0.8} />
      </mesh>
    </group>
  )
}

const noteSpots: [number, number, number][] = [
  [-0.9, 2.25, -2.2],
  [-0.28, 2.32, -2.2],
  [0.34, 2.22, -2.2],
  [0.95, 2.34, -2.2],
  [1.7, 2.28, -2.2],
  [-1.55, 1.62, -2.2],
  [1.85, 1.55, -2.2],
  [-2.15, 0.95, -2.2],
  [2.2, 1.15, -2.2],
]

function Notes({
  notes,
  onPick,
  onHover,
}: {
  notes: Note[]
  onPick: (id: string) => void
  onHover: (id: string | null) => void
}) {
  return (
    <group>
      {notes.slice(0, 9).map((note, index) => {
        const spot = noteSpots[index] ?? noteSpots[noteSpots.length - 1]
        const wobble = ((note.text.length * 17) % 10) / 100 - 0.05
        return (
          <Hit key={note.id} id={note.kind === 'visitor' ? `note:${note.text}` : `note:${note.text}`} onPick={onPick} onHover={onHover}>
            <NoteCard
              text={note.text}
              paper={note.kind === 'visitor' ? '#f6d2c8' : '#f4e2a8'}
              position={spot}
              rotation={[0, 0, wobble]}
            />
          </Hit>
        )
      })}
    </group>
  )
}

function NoteCard({
  text,
  paper,
  position,
  rotation,
}: {
  text: string
  paper: string
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const texture = useMemo(() => noteTexture(text, paper), [text, paper])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <planeGeometry args={[0.48, 0.36]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0.01]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color={'#8d2f2f'} />
      </mesh>
    </group>
  )
}

