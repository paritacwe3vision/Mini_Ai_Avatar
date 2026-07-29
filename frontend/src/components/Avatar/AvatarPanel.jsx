import "./AvatarPanel.css";
import Scene from "../../avatar/Scene";

export default function AvatarPanel() {
  return (
    <section className="avatar-panel">
      <div className="avatar-card">

        <div className="avatar-header">
          🤖 AI Avatar
        </div>

        <div className="avatar-body">

          <Scene />

        </div>

      </div>
    </section>
  );
}