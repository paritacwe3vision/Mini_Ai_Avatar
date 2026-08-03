import { useRef, useEffect } from "react";
import {
  useGLTF,
  useFBX,
  useAnimations,
} from "@react-three/drei";

export default function Mixamo({ emotion = "Idle" }) {
  const group = useRef();
  const currentAction = useRef();

  // ==========================================================
  // Avatar Model
  // ==========================================================

  const { scene } = useGLTF("/avatar/standing_waving.glb");

  // ==========================================================
  // Load Animations
  // ==========================================================

  const idle = useFBX("/animations/Standing_waving.fbx");
  const happy = useFBX("/animations/Happy.fbx");
  const thinking = useFBX("/animations/Thinking.fbx");
  const sad = useFBX("/animations/Sad.fbx");
  const angry = useFBX("/animations/Angry.fbx");
  const speaking = useFBX("/animations/Speaking.fbx");

  // ==========================================================
  // Rename Animations
  // ==========================================================

  if (idle.animations.length) {
    idle.animations[0].name = "Idle";
  }

  if (happy.animations.length) {
    happy.animations[0].name = "Happy";
  }

  if (thinking.animations.length) {
    thinking.animations[0].name = "Thinking";
  }

  if (sad.animations.length) {
    sad.animations[0].name = "Sad";
  }

  if (angry.animations.length) {
    angry.animations[0].name = "Angry";
  }

  if (speaking.animations.length) {
    speaking.animations[0].name = "Speaking";
  }

  // ==========================================================
  // Register Animations
  // ==========================================================

  const { actions } = useAnimations(
    [
      idle.animations[0],
      happy.animations[0],
      thinking.animations[0],
      sad.animations[0],
      angry.animations[0],
      speaking.animations[0],
    ],
    group
  );

  // ==========================================================
  // Enable Shadows
  // ==========================================================

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // ==========================================================
  // Play Animation
  // ==========================================================

  useEffect(() => {
    if (!actions) return;

    console.log("Emotion:", emotion);
    console.log("Available:", Object.keys(actions));

    const nextAction = actions[emotion] || actions["Idle"];

    if (!nextAction) {
      console.warn(`Animation '${emotion}' not found.`);
      return;
    }

    // Stop previous animation
    if (
      currentAction.current &&
      currentAction.current !== nextAction
    ) {
      currentAction.current.fadeOut(0.3);
    }

    nextAction.reset();
    nextAction.enabled = true;
    nextAction.setEffectiveWeight(1);
    nextAction.setEffectiveTimeScale(1);
    nextAction.fadeIn(0.3);
    nextAction.play();

    currentAction.current = nextAction;

  }, [emotion, actions]);

  // ==========================================================
  // Render Avatar
  // ==========================================================

  return (
    <group
      ref={group}
      position={[0, 0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[0.7, 0.7, 0.7]}
    >
      <primitive object={scene} />
    </group>
  );
}

// ==========================================================
// Preload Avatar
// ==========================================================

useGLTF.preload("/avatar/standing_waving.glb");