import { createContext, useContext, useState } from "react";

const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [animation, setAnimation] = useState("Idle");

  console.log("Current animation:", animation);

  return (
    <AvatarContext.Provider
      value={{
        animation,
        setAnimation,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  return useContext(AvatarContext);
}