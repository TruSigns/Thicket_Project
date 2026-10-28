import { useState } from "react";
import PageBanner from "../components/PageBanner";
import { useReveal } from "../hooks/useReveal";
import { contact, site } from "../content";
import { CopyIcon, CheckIcon } from "../components/Icons";

const COPY_LABELS = {
  idle: "Copy email",
  copied: "Copied",
  error: "Copy failed",
};

export default function Contact() {
  const [status, setStatus] = useState("idle");
  useReveal();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <main>
      <PageBanner
        seed={contact.seed}
        eyebrow={contact.eyebrow}
        word={contact.bigWord}
        title={contact.heading}
        intro={contact.intro}
      />

      <section className="section page-body contact">
        <div className="container contact-body">
          <a className="contact-email reveal" href={`mailto:${site.email}`}>
            {site.email}
          </a>

          <div className="contact-row reveal" style={{ "--d": "100ms" }}>
            <a className="btn btn--primary" href={`mailto:${site.email}`}>
              Send an email
            </a>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={copyEmail}
            >
              {status === "copied" ? <CheckIcon /> : <CopyIcon />}
              {COPY_LABELS[status]}
            </button>
          </div>

          <ul className="socials reveal" style={{ "--d": "200ms" }}>
            {site.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
