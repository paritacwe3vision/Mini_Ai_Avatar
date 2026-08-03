import "./AvatarPanel.css";
import Scene from "../../avatar/Scene";

export default function AvatarPanel({ emotion }) {
  return (
    <section className="avatar-panel">
      <div className="avatar-card">

        <div className="avatar-header">
          <div className="avatar-title">
            🤖 AI Avatar
          </div>

          <div className="avatar-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>

        <div className="avatar-body">
          <Scene emotion={emotion} />
        </div>

      </div>
    </section>
  );
}