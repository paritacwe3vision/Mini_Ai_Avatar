import { useRef, useEffect } from "react";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { useAvatar } from "./AvatarContext";


export default function ReadyPlayerAvatar() {

  const group = useRef();

  const { animation } = useAvatar();


  // Avatar Model
  const { scene } = useGLTF("/models/standing.glb");


  // Animations
  const idle = useFBX("/models/Happy Idle.fbx");
  const thinking = useFBX("/models/Thinking.fbx");
  const angry = useFBX("/models/Angry.fbx");
  const sad = useFBX("/models/Sad Idle.fbx");


  idle.animations[0].name = "Idle";
  thinking.animations[0].name = "Thinking";
  angry.animations[0].name = "Angry";
  sad.animations[0].name = "Sad";


  const { actions } = useAnimations(
    [
      idle.animations[0],
      thinking.animations[0],
      angry.animations[0],
      sad.animations[0],
    ],
    group
  );



  // Play Animation

  useEffect(() => {

    if (!actions) return;


    const currentAction =
      actions[animation] || actions["Idle"];


    Object.values(actions).forEach((action) => {
      action.stop();
    });


    if(currentAction){
      currentAction
        .reset()
        .fadeIn(0.5)
        .play();
    }


  },[animation, actions]);




  // Auto Center Avatar

  useEffect(()=>{

    if(!scene) return;


    const box = new Box3().setFromObject(scene);

    const center = box.getCenter(new Vector3());

    const size = box.getSize(new Vector3());


    scene.position.x -= center.x;
    scene.position.y -= center.y;
    scene.position.z -= center.z;


    const maxSize = Math.max(
      size.x,
      size.y,
      size.z
    );


    const scale = 2 / maxSize;


    scene.scale.set(
      scale,
      scale,
      scale
    );



    scene.traverse((child)=>{

      if(child.isMesh){

        child.castShadow = true;
        child.receiveShadow = true;

      }

    });


  },[scene]);



  return (

    <primitive
      ref={group}
      object={scene}
      position={[0,0,0]}
      rotation={[0,Math.PI,0]}
    />

  );

}



useGLTF.preload("/models/standing.glb");