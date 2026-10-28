import PageBanner from "../components/PageBanner";
import { useReveal } from "../hooks/useReveal";
import { work } from "../content";
import { ArrowUpRight } from "../components/Icons";

export default function Projects() {
  useReveal();

  return (
    <main>
      <PageBanner
        seed={work.seed}
        eyebrow={work.eyebrow}
        word={work.bigWord}
        title={work.heading}
        intro={work.intro}
      />

      <section className="section page-body">
        <div className="container">
          <ul className="project-grid">
            {work.items.map((project, i) => (
              <li
                key={project.title}
                className="reveal"
                style={{ "--d": `${i * 90}ms` }}
              >
                <article className="project">
                  <div className="project-meta">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{project.year}</span>
                  </div>
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-desc">{project.description}</p>
                  <ul className="chips">
                    {project.tags.map((tag, t) => (
                      <li key={`${tag}-${t}`}>{tag}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                        <ArrowUpRight />
                      </a>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
