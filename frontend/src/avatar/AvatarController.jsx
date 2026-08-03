import Scene from "./Scene";
import { useAvatar } from "./AvatarContext";

export default function AvatarController() {
  // Get current animation from AvatarContext
  const { animation } = useAvatar();

  return (
    <>
      <Scene emotion={animation} />
    </>
  );
}