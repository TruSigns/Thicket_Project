import PageBanner from "../components/PageBanner";
import { useReveal } from "../hooks/useReveal";
import { about } from "../content";

export default function About() {
  useReveal();

  return (
    <main>
      <PageBanner
        seed={about.seed}
        eyebrow={about.eyebrow}
        word={about.bigWord}
        title={about.heading}
        intro={about.intro}
      />

      <section className="section page-body about">
        <div className="container about-grid">
          <div>
            {about.paragraphs.map((text, i) => (
              <p
                key={i}
                className="body reveal"
                style={{ "--d": `${i * 90}ms` }}
              >
                {text}
              </p>
            ))}
          </div>

          <aside className="about-aside reveal" style={{ "--d": "150ms" }}>
            <dl className="facts">
              {about.facts.map((fact) => (
                <div className="fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="aside-label">Tools I reach for</p>
            <ul className="chips">
              {about.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
