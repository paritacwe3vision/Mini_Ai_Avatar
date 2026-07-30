import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";

import ReadyPlayerAvatar from "./ReadyPlayerAvatar";


export default function Scene() {

  return (
    <Canvas
      camera={{
        position: [0, 1.5, 5],
        fov: 45,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >

      <Suspense fallback={null}>

        {/* Lights */}
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[3, 5, 3]}
          intensity={2}
          castShadow
        />


        {/* Avatar */}
        <ReadyPlayerAvatar />


        {/* Environment */}
        <Environment preset="studio" />


        {/* Camera Control */}
        <OrbitControls
          target={[0, 1, 0]}
          enableZoom={true}
        />


      </Suspense>

    </Canvas>
  );
}