"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TechnologyExperience, ProjectQuestions } from "./technology-experience";
import { ProjectRequestForm } from "./project-request-form";



const services = [
  {
    no: "01",
    title: "Web Development",
    copy: "High-performance corporate websites and digital platforms built to earn trust and convert attention.",
    tags: ["Corporate", "E-Commerce", "SEO"],
  },
  {
    no: "02",
    title: "Custom Systems",
    copy: "Purpose-built systems that organise information, automate operations and support real workflows.",
    tags: ["Dashboard", "Automation", "Portal"],
  },
  {
    no: "03",
    title: "Digital Design",
    copy: "UI/UX, visual identity and brand experiences designed to look clear, modern and memorable.",
    tags: ["UI/UX", "Branding", "Motion"],
  },
  {
    no: "04",
    title: "Cybersecurity",
    copy: "Authorised assessment and security hardening for systems, websites, networks and business data.",
    tags: ["Assessment", "Hardening", "Awareness"],
  },
  {
    no: "05",
    title: "Cloud & Server",
    copy: "Reliable infrastructure for deployment, hosting, storage, monitoring, backup and business continuity.",
    tags: ["Linux", "Cloud", "Backup"],
  },
  {
    no: "06",
    title: "AI & Automation",
    copy: "Practical AI assistants and workflow automations that reduce repetitive work and improve response.",
    tags: ["AI Assistant", "Workflow", "Integration"],
  },
  {
    no: "07",
    title: "IT Support",
    copy: "Ongoing maintenance, troubleshooting and technical support that keeps everyday operations stable.",
    tags: ["Support", "Maintenance", "Remote"],
  },
];

const projects = [
  {
    index: "01",
    type: "Official TVET Information Portal",
    title: "MiCoSTSkills",
    status: "In development",
    copy: "A structured portal for students, lecturers and the public—bringing TVET programmes, admissions, e-learning and digital services into one trusted experience.",
    accent: "blue",
  },
  {
    index: "02",
    type: "Cybersecurity Awareness Platform",
    title: "CyberGuard AI",
    status: "Innovation concept",
    copy: "An AI-supported platform combining security awareness, guided learning, scanning concepts, quizzes and digital certificates.",
    accent: "cyan",
  },
  {
    index: "03",
    type: "Authorised Remote Administration",
    title: "SSH Control Center",
    status: "Technical prototype",
    copy: "A centralised control concept for authorised remote administration, monitored sessions and organised infrastructure access.",
    accent: "violet",
  },
];

const process = [
  ["Discover", "Understand the business, users, challenge and desired outcome."],
  ["Plan", "Define scope, content, technology, milestones and responsibilities."],
  ["Design", "Shape user flows, visual direction and interactive prototypes."],
  ["Build", "Engineer the frontend, backend, integrations and data layer."],
  ["Secure & Test", "Validate function, responsiveness, performance and security."],
  ["Launch", "Prepare deployment, domain, SSL, handover and go-live."],
  ["Support", "Maintain, improve and scale the solution after launch."],
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [motionPaused, setMotionPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      document.documentElement.style.setProperty(
        "--scroll-y",
        `${window.scrollY}px`,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty("--pointer-x", `${x}`);
      document.documentElement.style.setProperty("--pointer-y", `${y}`);
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.13 },
    );
    document.querySelectorAll(".scroll-reveal").forEach((item) => observer.observe(item));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site is-loaded" data-motion={motionPaused ? "paused" : "live"}>
      <a className="skip-link" href="#solutions">Skip to content</a>
      <div className="cursor-glow" aria-hidden="true" />
      <div
        className="scroll-progress"
        ref={progressRef}
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      <header className="nav-shell room-nav">
        <a className="brand" href="#top" onClick={closeMenu} aria-label="KASUZAZ Technology home">
          <Image className="brand-logo" src="/kasuzaz-technology-logo.png" alt="" width={400} height={400} priority />
          <span>KASUZAZ<small>TECHNOLOGY · MELAKA</small></span>
        </a>
        <nav className={`nav-links room-links ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}><span>01</span> Projects</a>
          <a href="#technology" onClick={closeMenu}><span>02</span> Experience</a>
          <a href="#about" onClick={closeMenu}><span>03</span> About</a>
          <a href="#contact" onClick={closeMenu}><span>04</span> Contact</a>
        </nav>
        <a className="nav-cta" href="https://wa.me/601124819812" target="_blank" rel="noreferrer">Let&apos;s talk <ArrowIcon /></a>
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><MenuIcon open={menuOpen} /></button>
      </header>

      <section className="hero room-hero" id="top" ref={heroRef}>
        <div className="room-atmosphere" aria-hidden="true" />
        <div className="room-grid" aria-hidden="true" />
        <div className="room-titlebar"><span><i /> KASUZAZ DIGITAL STUDIO</span><span>MELAKA, MY <b>·</b> AVAILABLE WORLDWIDE</span></div>
        <div className="room-scene" aria-label="A 3D-inspired digital studio with a Kasuzaz workstation">
          <div className="room-back-wall">
            <div className="room-window"><div className="window-glow" /><div className="cityline cityline-back" /><div className="cityline cityline-front" /><i /><i /></div>
            <div className="room-shelf"><span>BUILD / SECURE / GROW</span><div className="shelf-books"><i /><i /><i /><i /></div><b>K</b></div>
            <div className="room-poster"><span>KASUZAZ</span><b>Technology<br />for what&apos;s next.</b><i>EST. MELAKA · 2021</i></div>
            <div className="room-plant"><i /><i /><i /><b /></div>
          </div>
          <div className="room-floor"><div className="floor-light" /></div>
          <div className="studio-desk"><div className="desk-top"><div className="desk-mat" /><div className="desk-lamp"><i /><b /></div><div className="desk-mug"><i /></div></div><div className="desk-front" /></div>
          <div className="studio-monitor"><div className="monitor-frame"><div className="monitor-screen"><div className="screen-bar"><i /><i /><i /><span>kasuzaz.my / studio</span></div><div className="screen-content"><Image src="/kasuzaz-technology-logo.png" alt="KASUZAZ Technology" width={110} height={110} /><span className="screen-overline">SECURE DIGITAL SYSTEMS</span><b>Make ideas<br /><em>work better.</em></b><small>WEB · SYSTEMS · SECURITY · AI</small></div><div className="screen-status"><span><i /> ALL SYSTEMS READY</span><span>MY / 02.2026</span></div></div></div><div className="monitor-neck" /><div className="monitor-base" /></div>
          <div className="desk-keyboard"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="desk-tablet"><div><span>PROJECT / 024</span><b>Ideas into<br />real systems.</b><i>01 — 05</i></div></div>
          <div className="room-label label-window">THE STUDIO <i /></div><div className="room-label label-work">BUILT WITH INTENT <i /></div>
        </div>
        <div className="room-intro">
          <p className="eyebrow"><span className="status-dot" /> YOUR DIGITAL BUILD PARTNER</p>
          <h1>Ideas deserve<br /><em>a place to grow.</em></h1>
          <p className="hero-lead">We design and build secure websites, systems and digital experiences for the people shaping what comes next.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">Explore selected work <ArrowIcon /></a><a className="button button-ghost" href="#contact">Start a conversation</a></div>
        </div>
        <div className="room-caption"><span>01 / 04</span><i /><span>SELECT A SECTION TO EXPLORE</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>
      <section className="signal-strip" aria-label="Core capabilities">
        <span>WEB DEVELOPMENT</span>
        <i />
        <span>CUSTOM SYSTEMS</span>
        <i />
        <span>DIGITAL DESIGN</span>
        <i />
        <span>CYBERSECURITY</span>
        <i />
        <span>AI & AUTOMATION</span>
      </section>

      <section className="section solutions-intro" id="solutions">
        <div className="section-heading">
          <div>
            <p className="section-kicker">01 / Solutions</p>
            <h2>One technology partner.<br />Every digital layer.</h2>
          </div>
          <p>
            Strategy, design, engineering and support brought together under
            one focused studio. Every solution begins with the real problem,
            not the latest trend.
          </p>
        </div>

        <div className="service-preview-grid">
          {services.slice(0, 3).map((service) => (
            <article className="service-card scroll-reveal" key={service.no}>
              <div className={`service-motion service-motion-${service.no}`} aria-hidden="true"><i /><i /><i /><span>{["</>", "{ }", "✳"][Number(service.no) - 1]}</span></div>
              <div className="service-top">
                <span>{service.no}</span>
                <span className="card-arrow"><ArrowIcon /></span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <div className="tag-row">
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="capability-stage">
        <div className="capability-visual scroll-reveal">
          <div className="capability-image" aria-label="Cloud, cybersecurity, AI and server infrastructure visual">
            <span className="visual-label label-one">ENCRYPTED CORE</span>
            <span className="visual-label label-two">CONNECTED SYSTEMS</span>
            <span className="visual-cross cross-one" />
            <span className="visual-cross cross-two" />
          </div>
        </div>
        <div className="capability-list">
          <p className="section-kicker scroll-reveal">Full spectrum capability</p>
          <div className="capability-rows">
            {services.map((service) => (
              <article className="capability-row scroll-reveal" key={service.no}>
                <span>{service.no}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </div>
                <span className="capability-arrow"><ArrowIcon /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="value-band">
        <div className="value-statement scroll-reveal">
          <p className="section-kicker">Built differently</p>
          <h2>Not another vendor.<br /><span>Your digital build partner.</span></h2>
        </div>
        <div className="value-metrics scroll-reveal">
          <div><strong>07</strong><span>connected technology solutions</span></div>
          <div><strong>01</strong><span>accountable project partner</span></div>
          <div><strong>MY → ∞</strong><span>Malaysia based, remote worldwide</span></div>
        </div>
      </section>

      <TechnologyExperience />

      <section className="section work-section" id="work">
        <div className="section-heading scroll-reveal">
          <div>
            <p className="section-kicker">02 / Selected work</p>
            <h2>Ideas made visible.<br />Systems made real.</h2>
          </div>
          <p>
            We present every project honestly—whether it is in development,
            an innovation concept or a working technical prototype.
          </p>
        </div>

        <div className="project-stack">
          {projects.map((project) => (
            <article className={`project-card accent-${project.accent} scroll-reveal`} key={project.index}>
              <div className="project-number">{project.index}</div>
              <div className="project-copy">
                <p>{project.type}</p>
                <h3>{project.title}</h3>
                <span>{project.status}</span>
              </div>
              <p className="project-description">{project.copy}</p>
              <div className="project-orb" aria-hidden="true">
                <i /><i /><i />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="process-intro scroll-reveal">
          <p className="section-kicker">03 / How we build</p>
          <h2>Clarity at every stage.</h2>
          <p>
            A disciplined delivery process keeps the project understandable,
            measurable and aligned from the first conversation to long-term support.
          </p>
        </div>
        <div className="process-track">
          {process.map(([title, copy], index) => (
            <article className="process-step scroll-reveal" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="industries-section">
        <div className="industries-line" aria-hidden="true">
          <span>SMALL BUSINESS</span><i />
          <span>EDUCATION & TVET</span><i />
          <span>RETAIL & SERVICES</span><i />
          <span>STARTUPS & ORGANISATIONS</span><i />
          <span>REMOTE PROJECTS</span><i />
        </div>
        <div className="industries-content scroll-reveal">
          <p className="section-kicker">04 / Industries</p>
          <h2>Technology shaped around<br />how your organisation works.</h2>
          <div className="industry-grid">
            <article>
              <span>01</span>
              <h3>Small Business</h3>
              <p>Credible online presence, enquiries, booking, catalogues and customer records.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Education & TVET</h3>
              <p>Programme portals, e-learning, attendance, assessment and administration.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Retail & Services</h3>
              <p>Booking, inventory, payment, dashboards and customer-facing experiences.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Startups & Organisations</h3>
              <p>MVPs, internal systems, automation, cloud deployment and scalable foundations.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="founder-panel scroll-reveal">
          <div className="studio-origin"><span>LOCAL ROOTS. GLOBAL MINDSET.</span><div className="studio-monogram" aria-hidden="true">K<span>↗</span></div><p>Independent thinking.<br />Connected possibilities.</p><small>MELAKA, MALAYSIA → EVERYWHERE</small></div>
          <div className="founder-meta">
            <span>Founder / Lead Technologist</span>
            <strong>MUHAMMAD AIZUL HAZIQ</strong>
          </div>
        </div>
        <div className="about-copy scroll-reveal">
          <p className="section-kicker">05 / Company</p>
          <h2>Built in Melaka.<br />Designed for everywhere.</h2>
          <p>
            KASUZAZ TECHNOLOGY is an independent technology studio focused on
            turning practical ideas into structured digital systems. We combine
            web engineering, system administration, networking, design,
            cybersecurity and AI thinking within one clear delivery process.
          </p>
          <blockquote>
            “Technology should solve a real problem, remain secure and be built
            to grow with the people using it.”
          </blockquote>
          <div className="principles">
            <span>Integrity</span>
            <span>Security</span>
            <span>Innovation</span>
            <span>Clarity</span>
          </div>
        </div>
      </section>

      <ProjectQuestions />

      <section className="contact-section" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-copy scroll-reveal">
          <p className="section-kicker">Start a conversation</p>
          <h2>Have a challenge?<br /><span>Let&apos;s build what matters.</span></h2>
          <p>
            Share your business, website, system or digital idea. We will help
            identify the right solution and the next practical step.
          </p>
          <div className="contact-facts">
            <div><span>Phone</span><strong><a href="tel:+601124819812">+60 11-2481 9812</a></strong></div>
            <div><span>Location</span><strong>Melaka, Malaysia</strong></div>
            <div><span>Availability</span><strong>Remote · Worldwide</strong></div>
            <div><span>Focus</span><strong>Secure digital solutions</strong></div>
          </div>
        </div>

        <ProjectRequestForm />
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <Image
            className="brand-logo brand-logo-footer"
            src="/kasuzaz-technology-logo.png"
            alt=""
            width={400}
            height={400}
          />
          <div>
            <strong>KASUZAZ TECHNOLOGY</strong>
            <p>Secure. Build. Transform.</p>
          </div>
        </div>
        <div className="footer-links">
          <a href="#solutions">Solutions</a>
          <a href="#work">Our Work</a>
          <a href="#about">Company</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 KASUZAZ TECHNOLOGY · <a href="/privacy">Privacy</a> · <a href="/admin">Admin</a></span>
          <span>Melaka, Malaysia · Remote services worldwide</span>
        </div>
      </footer>
    </main>
  );
}
