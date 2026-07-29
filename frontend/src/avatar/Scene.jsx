import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";

import ReadyPlayerAvatar from "./ReadyPlayerAvatar";

export default function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 1.3, 3],
        fov: 35,
      }}
    >
      <ambientLight intensity={2} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
      />

      <ReadyPlayerAvatar />

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.5}
        blur={2}
        scale={10}
      />

      <Environment preset="city" />

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={5}
      />
    </Canvas>
  );
}