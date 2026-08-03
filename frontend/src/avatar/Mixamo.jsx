import { useRef, useEffect } from "react";
//import { useRef, useEffect } from "react";
import {
  useGLTF,
  useFBX,
  useAnimations,
} from "@react-three/drei";

export default function Mixamo({ emotion = "Waving" }) {
  const group = useRef();

  // ==========================
  // Avatar Model
  // ==========================
  const { scene } = useGLTF("/avatar/standing_waving.glb");

  // ==========================
  // Load Waving Animation
  // ==========================
  const waving = useFBX("/animations/Standing_waving.fbx");
  const happy = useFBX("/animations/Happy.fbx");
  const thinking = useFBX("/animations/Thinking.fbx");
  const sad = useFBX("/animations/Sad.fbx");
  const angry = useFBX("/animations/Angry.fbx");

  const currentAction = useRef();
  // Rename animation
  if (waving.animations.length > 0) {
    waving.animations[0].name = "Waving";
  }
  if (happy.animations.length > 0) {
  happy.animations[0].name = "Happy";
  }

  if (thinking.animations.length > 0) {
    thinking.animations[0].name = "Thinking";
  }

  if (sad.animations.length > 0) {
    sad.animations[0].name = "Sad";
  }

  if (angry.animations.length > 0) {
    angry.animations[0].name = "Angry";
  }

  // Attach animation to avatar
const { actions } = useAnimations(
  [
    waving.animations[0],
    happy.animations[0],
    thinking.animations[0],
    sad.animations[0],
    angry.animations[0],
  ],
  group
);

  // ==========================
  // Enable Shadows
  // ==========================
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // ==========================
  // Play Animation
  // ==========================
 useEffect(() => {
  if (!actions) return;

  const nextAction = actions[emotion];

  if (!nextAction) {
    console.log("Animation not found:", emotion);
    return;
  }

  if (currentAction.current === nextAction) return;

  nextAction.reset();
  nextAction.enabled = true;
  nextAction.setEffectiveWeight(1);
  nextAction.fadeIn(0.3);
  nextAction.play();

  if (currentAction.current) {
    currentAction.current.crossFadeTo(nextAction, 0.3, true);
  }

  currentAction.current = nextAction;
}, [actions, emotion]);

  // ==========================
  // Render Avatar
  // ==========================
  return (
    <group
      ref={group}
      position={[0, 0.5, 0]}
      rotation={[ -Math.PI/2,0, 0]}
      scale={[0.7, 0.7, 0.7]}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload Assets
useGLTF.preload("/avatar/standing_waving.glb");
