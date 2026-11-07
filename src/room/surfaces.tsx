import { useLayoutEffect } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

type Maps = [THREE.Texture, THREE.Texture, THREE.Texture]

function useMaps(urls: [string, string, string], repeatX: number, repeatY: number): Maps {
  const maps = useTexture(urls) as Maps
  useLayoutEffect(() => {
    const [color, normal, rough] = maps
    for (const texture of maps) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeatX, repeatY)
      texture.anisotropy = 8
    }
    color.colorSpace = THREE.SRGBColorSpace
    normal.colorSpace = THREE.NoColorSpace
    rough.colorSpace = THREE.NoColorSpace
  }, [maps[0], maps[1], maps[2], repeatX, repeatY])
  return maps
}

export function FloorMaterial() {
  const [map, normalMap, roughnessMap] = useMaps(
    ['/textures/floor_diff.jpg', '/textures/floor_nor.jpg', '/textures/floor_rough.jpg'],
    3.2,
    2.4,
  )
  return (
    <meshPhysicalMaterial
      map={map}
      normalMap={normalMap}
      roughnessMap={roughnessMap}
      roughness={0.85}
      metalness={0}
      envMapIntensity={0.28}
      normalScale={new THREE.Vector2(0.85, 0.85)}
    />
  )
}

export function WallMaterial() {
  const [map, normalMap, roughnessMap] = useMaps(
    ['/textures/wall_diff.jpg', '/textures/wall_nor.jpg', '/textures/wall_rough.jpg'],
    1.8,
    1.2,
  )
  return (
    <meshPhysicalMaterial
      map={map}
      normalMap={normalMap}
      roughnessMap={roughnessMap}
      color={'#c9beb2'}
      roughness={0.92}
      metalness={0}
      envMapIntensity={0.22}
      normalScale={new THREE.Vector2(0.55, 0.55)}
    />
  )
}

export function WoodMaterial({ color = '#ffffff' }: { color?: string }) {
  const [map, normalMap, roughnessMap] = useMaps(
    ['/textures/wood_diff.jpg', '/textures/wood_nor.jpg', '/textures/wood_rough.jpg'],
    1.6,
    1.2,
  )
  return (
    <meshPhysicalMaterial
      map={map}
      normalMap={normalMap}
      roughnessMap={roughnessMap}
      color={color}
      roughness={0.62}
      metalness={0}
      envMapIntensity={0.4}
      normalScale={new THREE.Vector2(0.7, 0.7)}
    />
  )
}

export function MetalMaterial({ color = '#1a1c1f', roughness = 0.28 }: { color?: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} metalness={0.92} roughness={roughness} envMapIntensity={1.1} />
}
