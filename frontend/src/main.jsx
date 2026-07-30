import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AvatarProvider } from "./avatar/AvatarContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <AvatarProvider>

    <App />

  </AvatarProvider>

);