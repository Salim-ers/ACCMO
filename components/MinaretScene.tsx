"use client";

import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows, Sparkles } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

// Palette identité Essalam (façade crème + vert + or)
const WALL = "#ece0c2";
const WALL_LIGHT = "#f3ead3";
const GREEN_ROOF = "#1f5a40";
const GREEN_DOOR = "#155138";
const GOLD = "#d4af56";
const TREE = "#2c5a3f";
const TRUNK = "#7a5a36";

/** Texture zellige générée pour les panneaux décoratifs du minaret. */
function useZelligeTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#efe6cf";
    g.fillRect(0, 0, 128, 128);
    // étoile à 8 branches
    const cx = 64,
      cy = 64,
      R = 60,
      r = 26;
    g.beginPath();
    for (let k = 0; k < 16; k++) {
      const ang = (k * Math.PI) / 8;
      const rad = k % 2 === 0 ? R : r;
      const x = cx + rad * Math.cos(ang);
      const y = cy + rad * Math.sin(ang);
      if (k === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.fillStyle = "#e1d0a3";
    g.fill();
    g.strokeStyle = "#b29a63";
    g.lineWidth = 2.5;
    g.stroke();
    // petit losange central
    g.fillStyle = "#b29a63";
    g.beginPath();
    g.moveTo(cx, cy - 7);
    g.lineTo(cx + 7, cy);
    g.lineTo(cx, cy + 7);
    g.lineTo(cx - 7, cy);
    g.closePath();
    g.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function Cypress(props: ThreeElements["group"] & { h: number }) {
  const { h, ...rest } = props;
  return (
    <group {...rest}>
      <mesh castShadow position={[0, h / 2, 0]}>
        <coneGeometry args={[0.32, h, 14]} />
        <meshStandardMaterial color={TREE} roughness={1} />
      </mesh>
    </group>
  );
}

function Palm(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 1.4, 8]} />
        <meshStandardMaterial color={TRUNK} roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0]} scale={[1, 0.6, 1]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#2f6644" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

/** Minaret stylisé fidèle à la Mosquée Essalam de Creil. */
function Minaret() {
  const zellige = useZelligeTexture();

  return (
    <group position={[0, -1.4, 0]}>
      {/* ---- Salle de prière ---- */}
      <mesh castShadow receiveShadow position={[-1.9, 0.95, 0]}>
        <boxGeometry args={[4, 1.9, 2.7]} />
        <meshStandardMaterial color={WALL} roughness={0.92} />
      </mesh>
      {/* Toit en croupe vert (pyramide basse étirée) */}
      <mesh castShadow position={[-1.9, 2.2, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.45, 1, 0.95]}>
        <coneGeometry args={[2.2, 0.85, 4]} />
        <meshStandardMaterial color={GREEN_ROOF} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Corniche */}
      <mesh position={[-1.9, 1.92, 0]}>
        <boxGeometry args={[4.12, 0.12, 2.82]} />
        <meshStandardMaterial color={WALL_LIGHT} roughness={0.85} />
      </mesh>
      {/* Fenêtres de la salle */}
      {[-3.1, -2.3, -1.5, -0.7].map((x) => (
        <mesh key={x} position={[x, 0.95, 1.36]}>
          <boxGeometry args={[0.4, 0.6, 0.06]} />
          <meshStandardMaterial color="#3c4a44" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}

      {/* ---- Tour du minaret ---- */}
      <mesh castShadow receiveShadow position={[1.95, 2.6, 0]}>
        <boxGeometry args={[1.35, 5.2, 1.35]} />
        <meshStandardMaterial color={WALL_LIGHT} roughness={0.88} />
      </mesh>

      {/* Panneaux décoratifs zellige (face avant + face latérale) */}
      {zellige && (
        <>
          <mesh position={[1.6, 2.9, 0.681]}>
            <planeGeometry args={[0.34, 3.4]} />
            <meshStandardMaterial map={zellige} bumpMap={zellige} bumpScale={0.04} roughness={0.9} />
          </mesh>
          <mesh position={[2.3, 2.9, 0.681]}>
            <planeGeometry args={[0.34, 3.4]} />
            <meshStandardMaterial map={zellige} bumpMap={zellige} bumpScale={0.04} roughness={0.9} />
          </mesh>
          <mesh position={[2.631, 2.9, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.34, 3.4]} />
            <meshStandardMaterial map={zellige} bumpMap={zellige} bumpScale={0.04} roughness={0.9} />
          </mesh>
        </>
      )}
      {/* Petites fenêtres en colonne au centre de la tour */}
      {[1.6, 2.5, 3.4, 4.3].map((y) => (
        <mesh key={y} position={[1.95, y, 0.681]}>
          <boxGeometry args={[0.26, 0.34, 0.05]} />
          <meshStandardMaterial color="#3c4a44" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}

      {/* Auvent en tuiles vertes + portes vertes (entrée) */}
      <mesh castShadow position={[1.95, 1.45, 0.95]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[1.05, 0.1, 0.6]} />
        <meshStandardMaterial color={GREEN_ROOF} roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[1.95, 0.62, 0.69]}>
        <boxGeometry args={[0.8, 1.25, 0.05]} />
        <meshStandardMaterial color={GREEN_DOOR} roughness={0.5} metalness={0.25} />
      </mesh>

      {/* ---- Couronne en gradins (crénelée) ---- */}
      <mesh position={[1.95, 5.28, 0]}>
        <boxGeometry args={[1.5, 0.18, 1.5]} />
        <meshStandardMaterial color={WALL_LIGHT} roughness={0.85} />
      </mesh>
      {/* merlons latéraux + pic central */}
      <mesh castShadow position={[1.45, 5.6, 0]}>
        <boxGeometry args={[0.38, 0.5, 1.4]} />
        <meshStandardMaterial color={WALL_LIGHT} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[2.45, 5.6, 0]}>
        <boxGeometry args={[0.38, 0.5, 1.4]} />
        <meshStandardMaterial color={WALL_LIGHT} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[1.95, 5.95, 0]}>
        <boxGeometry args={[0.55, 1, 1.42]} />
        <meshStandardMaterial color={WALL_LIGHT} roughness={0.85} />
      </mesh>
      {/* coiffe pyramidale verte */}
      <mesh castShadow position={[1.95, 6.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.5, 0.6, 4]} />
        <meshStandardMaterial color={GREEN_ROOF} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* ---- Finition dorée (mât + boule + croissant) ---- */}
      <mesh position={[1.95, 7.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[1.95, 7.55, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} emissive={GOLD} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[1.95, 7.85, 0]} rotation={[0, 0, Math.PI * 0.15]}>
        <torusGeometry args={[0.16, 0.035, 14, 28, Math.PI * 1.45]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} emissive={GOLD} emissiveIntensity={0.35} />
      </mesh>

      {/* ---- Végétation ---- */}
      <Cypress position={[-4.4, 0, 1.4]} h={2.1} />
      <Cypress position={[-3.6, 0, 1.6]} h={1.5} />
      <Palm position={[-2.7, 0, 1.7]} />
      <Cypress position={[-0.4, 0, 1.7]} h={1.7} />
    </group>
  );
}

export default function MinaretScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [8.5, 5.2, 9.5], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        {/* Éclairage golden hour : ciel chaud + soleil rasant */}
        <hemisphereLight color="#fff3da" groundColor="#5a4a2e" intensity={1} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[-5, 10, 7]}
          intensity={2.6}
          color="#ffe4b0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-camera-far={45}
        />
        <directionalLight position={[8, 4, -6]} intensity={0.7} color="#bfe0cf" />

        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
          <Minaret />
        </Float>

        <ContactShadows position={[0, -1.42, 0]} opacity={0.55} scale={20} blur={2.8} far={8} color="#0f2b21" />
        <Sparkles count={80} scale={[16, 10, 16]} size={3} speed={0.3} color={GOLD} opacity={0.65} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.7}
          target={[0.3, 1.6, 0]}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Suspense>
    </Canvas>
  );
}
