import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import { notFound } from "../content";
import { ArrowLeft, ArrowRight } from "../components/Icons";

export default function NotFound() {
  return (
    <main>
      <PageBanner
        full
        seed={notFound.seed}
        eyebrow={notFound.eyebrow}
        word="404"
        title={notFound.heading}
        intro={notFound.copy}
      >
        <Link to="/" className="btn btn--primary">
          <ArrowLeft />
          Back to the trailhead
        </Link>
        <Link to="/projects" className="btn btn--ghost">
          See the projects
          <ArrowRight />
        </Link>
      </PageBanner>
    </main>
  );
}
