"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows, Sparkles } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

// Palette identité mosquée
const CREAM = "#e9dcc0";
const CREAM_LIGHT = "#f3ead6";
const GREEN = "#1a4f3a";
const GREEN_TREE = "#234e38";
const GOLD = "#d4af56";

function Cypress(props: ThreeElements["mesh"] & { h: number }) {
  const { h, ...rest } = props;
  return (
    <mesh castShadow {...rest}>
      <coneGeometry args={[0.3, h, 12]} />
      <meshStandardMaterial color={GREEN_TREE} roughness={1} />
    </mesh>
  );
}

/** Minaret stylisé inspiré de la Mosquée Essalam de Creil. */
function Minaret() {
  return (
    <group position={[0, -1.3, 0]}>
      {/* Salle de prière */}
      <mesh castShadow receiveShadow position={[-1.7, 0.7, 0]}>
        <boxGeometry args={[3.3, 1.7, 2.3]} />
        <meshStandardMaterial color={CREAM} roughness={0.92} />
      </mesh>
      {/* Toit pyramidal vert */}
      <mesh castShadow position={[-1.7, 1.85, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.15, 0.9, 4]} />
        <meshStandardMaterial color={GREEN} roughness={0.55} metalness={0.12} />
      </mesh>

      {/* Tour du minaret */}
      <mesh castShadow receiveShadow position={[1.35, 2.2, 0]}>
        <boxGeometry args={[1.15, 4.8, 1.15]} />
        <meshStandardMaterial color={CREAM_LIGHT} roughness={0.88} />
      </mesh>
      {/* Bandeau décoratif vert */}
      <mesh position={[1.35, 3.7, 0]}>
        <boxGeometry args={[1.22, 0.55, 1.22]} />
        <meshStandardMaterial color={GREEN} roughness={0.55} />
      </mesh>
      {/* Couronne */}
      <mesh castShadow position={[1.35, 4.85, 0]}>
        <boxGeometry args={[0.85, 0.65, 0.85]} />
        <meshStandardMaterial color={CREAM_LIGHT} roughness={0.85} />
      </mesh>
      {/* Dôme vert */}
      <mesh castShadow position={[1.35, 5.15, 0]}>
        <sphereGeometry args={[0.52, 28, 28, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GREEN} roughness={0.35} metalness={0.25} />
      </mesh>
      {/* Mât doré */}
      <mesh position={[1.35, 5.85, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.75, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Boule dorée */}
      <mesh position={[1.35, 6.28, 0]}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} emissive={GOLD} emissiveIntensity={0.35} />
      </mesh>
      {/* Croissant doré */}
      <mesh position={[1.35, 6.65, 0]} rotation={[0, 0, Math.PI * 0.15]}>
        <torusGeometry args={[0.17, 0.04, 14, 28, Math.PI * 1.45]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} emissive={GOLD} emissiveIntensity={0.3} />
      </mesh>

      {/* Cyprès */}
      <Cypress position={[-3.6, 0.0, 1.2]} h={1.9} />
      <Cypress position={[-2.8, -0.1, 1.4]} h={1.4} />
      <Cypress position={[-0.2, 0.0, 1.5]} h={1.6} />
    </group>
  );
}

export default function MinaretScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [7.5, 4.8, 8.5], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[6, 11, 5]}
          intensity={2.4}
          color="#ffdca6"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-camera-far={40}
        />
        <directionalLight position={[-7, 4, -5]} intensity={0.6} color="#7fbb9d" />

        <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.5}>
          <Minaret />
        </Float>

        <ContactShadows position={[0, -1.32, 0]} opacity={0.5} scale={18} blur={2.6} far={7} color="#0f2b21" />
        <Sparkles count={70} scale={[14, 9, 14]} size={3} speed={0.35} color={GOLD} opacity={0.7} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.85}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Suspense>
    </Canvas>
  );
}
