import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";

import ReadyPlayerAvatar from "./ReadyPlayerAvatar";

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 1.3, 3.5],
        fov: 35,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Suspense fallback={null}>

        {/* Lighting */}
        <ambientLight intensity={0.8} />

        <directionalLight
          position={[5, 8, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <directionalLight
          position={[-5, 4, 2]}
          intensity={0.8}
        />

        {/* Studio Environment */}
        <Environment preset="studio" />


        {/* Avatar */}
        <ReadyPlayerAvatar />


        {/* Camera Controls */}
        <OrbitControls
          target={[0, 1.2, 0]}
          enablePan={false}
          enableZoom={true}

          minDistance={2.5}
          maxDistance={5}

          // allow small vertical movement
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />

      </Suspense>
    </Canvas>
  );
}