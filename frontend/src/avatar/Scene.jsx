import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

import Mixamo from "./Mixamo";
import { useAvatar } from "./AvatarContext";

export default function Scene() {

  const { animation } = useAvatar();

  console.log("Scene animation:", animation);

  return (
    <Canvas
      shadows
      camera={{
        position:[0,1.4,2.8],
        fov:30
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >

      <Suspense fallback={null}>

        <ambientLight intensity={0.8} />

        <directionalLight
          position={[5,8,5]}
          intensity={2}
          castShadow
        />

        <directionalLight
          position={[-5,4,2]}
          intensity={0.8}
        />

        <hemisphereLight
          intensity={1.2}
          groundColor="#444"
        />


        <Mixamo emotion={animation} />


        <OrbitControls
          target={[0,1.2,0]}
          enablePan={false}
          enableZoom={true}
          minDistance={2.4}
          maxDistance={3.4}
        />


      </Suspense>

    </Canvas>
  );
}