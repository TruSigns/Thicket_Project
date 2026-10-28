import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import { home } from "../content";
import { ArrowRight } from "../components/Icons";

export default function Home() {
  return (
    <main>
      <PageBanner
        full
        seed={home.seed}
        eyebrow={home.eyebrow}
        word={home.bigWord}
        title={home.heading}
        intro={home.copy}
      >
        <Link to={home.primary.to} className="btn btn--primary">
          {home.primary.label}
          <ArrowRight />
        </Link>
        <Link to={home.secondary.to} className="btn btn--ghost">
          {home.secondary.label}
        </Link>
      </PageBanner>
    </main>
  );
}
