import { useState } from "react";
import SpinXSymbol, { type SpinXMotion } from "./SpinXSymbol";
import "./spinx-symbol-animation.css";

export function SpinXFabExample() {
  const [motion, setMotion] = useState<SpinXMotion>("idle");

  function handleOpen() {
    setMotion("engage");
    window.setTimeout(() => setMotion("active"), 900);
  }

  function handleClose() {
    setMotion("settle");
    window.setTimeout(() => setMotion("idle"), 1100);
  }

  return (
    <div className="spinx-fab-demo">
      <button className="spinx-fab" aria-label="Open SpinX assistant" onClick={handleOpen}>
        <SpinXSymbol size={48} motion={motion} title="" />
      </button>
      <button onClick={handleClose}>Close / settle</button>
    </div>
  );
}
