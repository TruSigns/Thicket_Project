import ForestBackdrop from "../forest/ForestBackdrop";

/**
 * Forest scene that opens every page.
 * full = full-screen (Home, 404); otherwise a shorter banner.
 * children = action buttons shown under the title.
 */
export default function PageBanner({
  seed,
  eyebrow,
  word,
  title,
  intro,
  full = false,
  children,
}) {
  return (
    <section className={full ? "scene" : "scene scene--banner"}>
      <ForestBackdrop seed={seed}>
        <div className="forest-title">
          <p className="eyebrow rise" style={{ "--d": "150ms" }}>
            <span className="rule" />
            {eyebrow}
            <span className="rule" />
          </p>
          <p
            className="forest-word rise"
            style={{ "--d": "250ms" }}
            aria-hidden="true"
          >
            {word}
          </p>
        </div>
      </ForestBackdrop>

      <div className="scene-content">
        <h1 className="scene-heading rise" style={{ "--d": "500ms" }}>
          {title}
        </h1>
        {intro && (
          <p className="scene-copy rise" style={{ "--d": "650ms" }}>
            {intro}
          </p>
        )}
        {children && (
          <div className="scene-actions rise" style={{ "--d": "800ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
