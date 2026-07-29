import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function ReadyPlayerAvatar() {
  const group = useRef();

  const { scene, animations } = useGLTF("/models/standing.glb");

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;

    const names = Object.keys(actions);
    console.log("Animations:", names);

    if (names.length > 0) {
      actions[names[0]].reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.4}
      position={[0, -1.4, 0]}
    />
  );
}

useGLTF.preload("/models/standing.glb");