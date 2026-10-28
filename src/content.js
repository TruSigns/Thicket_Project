export const site = {
  brand: "Just Some Random Developer",
  name: "Maurice Ruffin",
  email: "Stephfan.Maurice.Ruffin@pm.me",
  resumeHref: "/resume.pdf",
  nav: [
    { label: "About", to: "/about" },
    { label: "Projects", to: "/projects" },
    { label: "Contact", to: "/contact" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/TruSigns" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/maurice-ruffin-877ba6119/",
    },
  ],
};

/* bigWord: keep it 7 letters or fewer so it fits between the trees */

export const home = {
  seed: 42,
  eyebrow: "Software developer",
  bigWord: "Dream",
  heading: "Maurice Ruffin",
  copy: "I build calm, careful software, from the interface all the way down to the infrastructure.",
  primary: { label: "View projects", to: "/projects" },
  secondary: { label: "About me", to: "/about" },
};

export const about = {
  seed: 11,
  eyebrow: "Field notes",
  bigWord: "about",
  heading: "The person behind the trees.",
  intro: "A developer who follows problems all the way down.",
  paragraphs: [
    "I'm a software developer who spends most of my time on the frontend, with a habit of following problems all the way into the backend.",
    "I care about the details people feel but rarely notice: interfaces that respond instantly, errors that explain themselves, and systems that fail loudly instead of quietly.",
    "Outside of work I build small side projects to learn things properly, like rate limiting, retries, and the occasional procedurally generated forest.",
  ],
  facts: [
    { label: "Currently", value: "Software Developer" },
    { label: "Focus", value: "Frontend & full-stack" },
    { label: "Based in", value: "Four Oaks, North Carolina" },
    { label: "Off the clock", value: "Side projects, trails" },
  ],
  skills: [
    "TypeScript",
    "Angular",
    "React",
    "Node.js",
    "Python",
    "AWS Lambda",
    "DynamoDB",
    "REST APIs",
  ],
};

export const work = {
  seed: 23,
  eyebrow: "Clearings",
  bigWord: "work",
  heading: "Selected projects.",
  intro: "Things I've built to ship, to learn, or just to scratch an itch.",
  items: [
    {
      title: "Instagram Image Downloader",
      year: "2026",
      description:
        "A Python CLI that downloads images from public profiles, built to learn sessions, per-host rate limiting, and retries with exponential backoff.",
      tags: ["Python", "requests", "CLI"],
      links: [
        {
          label: "Source",
          href: "https://github.com/TruSigns/Pythong_Ig_Downloader",
        },
      ],
    },
    {
      title: "Thicket",
      year: "2026",
      description:
        "This site. A React portfolio with a procedurally drawn night forest: seeded canvas tree layers, drifting mist, and fireflies.",
      tags: ["React", "Canvas", "CSS"],
      links: [{ label: "Source", href: "https://github.com/TruSigns/thicket" }],
    },
    {
      title: "Project three",
      year: "2025",
      description:
        "Replace this with another project: what it does, the problem it solved, and what you learned building it.",
      tags: ["Tag", "Tag", "Tag"],
      links: [
        { label: "Live", href: "#" },
        { label: "Source", href: "#" },
      ],
    },
  ],
};

export const contact = {
  seed: 5,
  eyebrow: "Trailhead",
  bigWord: "contact",
  heading: "Let's build something together.",
  intro:
    "Whether it's a role, a collaboration, or just a question, my inbox is open.",
};

export const notFound = {
  seed: 7,
  eyebrow: "Off the trail",
  heading: "Wandered off.",
  copy: "This path fades somewhere into the trees. Let's lead you back to the trailhead.",
};
