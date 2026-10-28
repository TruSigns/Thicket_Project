import { useForestScene } from "./useForestScene";
import "./forest.css";

/**
 * Full-bleed night forest. Children render BETWEEN the far and near
 * tree layers, so big background type sits inside the forest.
 */
export default function ForestBackdrop({ seed = 42, children }) {
  const { backRef, frontRef, fliesRef } = useForestScene(seed);

  return (
    <div className="forest">
      <div className="forest-sky" aria-hidden="true">
        <div className="forest-moon" />
      </div>
      <canvas
        ref={backRef}
        className="forest-layer forest-layer--back"
        aria-hidden="true"
      />
      <div className="forest-fog forest-fog--back" aria-hidden="true" />
      <div className="forest-lantern" aria-hidden="true">
        <span className="forest-lantern-light" />
        <span className="forest-lantern-base" />
      </div>
      <div className="forest-lantern-pool" aria-hidden="true" />s
      <div className="forest-mid">{children}</div>
      <canvas
        ref={frontRef}
        className="forest-layer forest-layer--front"
        aria-hidden="true"
      />
      <div className="forest-fog forest-fog--front" aria-hidden="true" />
      <canvas
        ref={fliesRef}
        className="forest-layer forest-layer--flies"
        aria-hidden="true"
      />
      <div className="forest-vignette" aria-hidden="true" />
    </div>
  );
}
