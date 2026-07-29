import { useState } from "react";
import Scene from "./Scene";

export default function AvatarController() {
  const [emotion, setEmotion] = useState("Idle");

  return (
    <>
      <Scene emotion={emotion} />

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        <button onClick={() => setEmotion("Idle")}>Idle</button>
        <button onClick={() => setEmotion("Happy")}>Happy</button>
        <button onClick={() => setEmotion("Thinking")}>Think</button>
        <button onClick={() => setEmotion("Sad")}>Sad</button>
        <button onClick={() => setEmotion("Talking")}>Talk</button>
      </div>
    </>
  );
}