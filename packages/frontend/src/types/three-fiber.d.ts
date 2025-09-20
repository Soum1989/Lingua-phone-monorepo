// TypeScript declarations for Three.js elements in React Three Fiber

import { Object3DNode, MaterialNode, LightNode } from '@react-three/fiber'
import * as THREE from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>
      ringGeometry: Object3DNode<THREE.RingGeometry, typeof THREE.RingGeometry>
      meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>
      meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
      meshPhongMaterial: MaterialNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>
      ambientLight: LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      pointLight: LightNode<THREE.PointLight, typeof THREE.PointLight>
      directionalLight: LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
    }
  }
}