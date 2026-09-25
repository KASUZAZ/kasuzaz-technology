"use client";

import { useState } from "react";

const layers = [
  { name: "Experience", code: "01 / INTERFACE", title: "Where people meet possibility.", copy: "Fast websites, intuitive portals and purposeful interfaces. Every interaction connects your audience to the things they need.", nodes: ["Web platform", "Customer portal", "Design system"], detail: "Responsive interfaces · Accessible journeys · Clear content" },
  { name: "Intelligence", code: "02 / AUTOMATION", title: "Less repetition. More momentum.", copy: "Connect business tools, organise information and introduce practical AI assistance where it can make everyday work easier.", nodes: ["AI assistant", "Workflow engine", "API integration"], detail: "Human oversight · Connected workflows · Useful insights" },
  { name: "Infrastructure", code: "03 / FOUNDATION", title: "A stronger foundation for what comes next.", copy: "Bring applications, servers and data together with a considered deployment plan, monitoring and recovery built into the conversation.", nodes: ["Cloud hosting", "Data services", "Observability"], detail: "Deployment planning · Backup strategy · System visibility" },
  { name: "Security", code: "04 / PROTECTION", title: "Trust belongs in every layer.", copy: "Consider access, configuration and protection from the beginning. Security is part of how we design and build your system.", nodes: ["Access control", "System hardening", "Security review"], detail: "Least privilege · Authorised assessment · Secure configuration" },
];

export function TechnologyExperience() {
  const [active, setActive] = useState(0);
  const layer = layers[active];

  return (
    <section className="technology-section" id="technology">
      <div className="section-heading scroll-reveal">
        <div><p className="section-kicker">The connected ecosystem</p><h2>Different layers.<br /><span className="gradient-text">One powerful whole.</span></h2></div>
        <p>Explore how we connect experience, intelligence, infrastructure and security around your business. Select a layer to see the architecture.</p>
      </div>
      <div className="architecture-console scroll-reveal">
        <div className="console-bar"><span><i /> KASUZAZ / SYSTEM ARCHITECTURE</span><span>INTERACTIVE EXPLORER</span></div>
        <div className="layer-controls" aria-label="Technology layers">
          {layers.map((item, index) => <button type="button" key={item.name} aria-pressed={active === index} aria-controls="layer-content" onClick={() => setActive(index)}><span>0{index + 1}</span>{item.name}<span className="layer-indicator">↗</span></button>)}
        </div>
        <div className="architecture-body" id="layer-content" aria-live="polite">
          <div className="architecture-copy" key={layer.name}><p className="section-kicker">{layer.code}</p><h3>{layer.title}</h3><p>{layer.copy}</p><div className="architecture-detail">{layer.detail}</div><a href="#contact" className="text-link">Build your connected system <span>↗</span></a></div>
          <div className={`network-diagram network-layer-${active}`}>
            <div className="network-grid" aria-hidden="true" />
            <svg className="network-paths" viewBox="0 0 600 420" fill="none" aria-hidden="true"><path d="M300 210V75H110M300 210V75H490M300 210V345" /><path className="packet-path" d="M110 75H300V210M490 75H300V210M300 210V345" /></svg>
            <div className="network-core"><span className="core-orbit" aria-hidden="true" /><b>K</b><small>CONNECTED CORE</small></div>
            {layer.nodes.map((node, index) => <div className={`network-endpoint endpoint-${index}`} key={node}><span className="endpoint-icon" aria-hidden="true">{["⌘", "◇", "▤"][index]}</span><strong>{node}</strong><small>{layer.name.toUpperCase()}</small></div>)}
            <span className="diagram-caption">ILLUSTRATIVE SYSTEM MAP / NOT LIVE TELEMETRY</span>
          </div>
        </div>
      </div>
      <div className="engineering-notes">
        <article className="scroll-reveal"><span>01 / PERFORMANCE</span><h3>Built to move.</h3><p>Thoughtful interfaces, efficient code and responsive experiences across devices.</p><div className="wave-bars" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.13}s`, height: `${18 + ((i * 17) % 47)}px` }} />)}</div></article>
        <article className="scroll-reveal"><span>02 / RESILIENCE</span><h3>Ready for change.</h3><p>Maintainable systems, documented decisions and room for your next stage of growth.</p><div className="resilience-visual" aria-hidden="true"><i /><i /><i /><span>BUILD → EVOLVE → SCALE</span></div></article>
        <article className="scroll-reveal"><span>03 / PARTNERSHIP</span><h3>People behind the code.</h3><p>A direct technical partner, clear project scope and practical conversations from day one.</p><a className="text-link" href="#contact">Let’s talk about your idea <span>↗</span></a></article>
      </div>
    </section>
  );
}

export function ProjectQuestions() {
  return <section className="questions-section">
    <div className="scroll-reveal"><p className="section-kicker">Before we build</p><h2>Big ideas.<br />Clear answers.</h2><p>Good technology starts with a good conversation.</p></div>
    <div className="questions-list scroll-reveal">
      {[
        ["Where do we start?", "Tell us what your organisation does, what is getting in the way and what you would like to achieve. We can then discuss a practical scope, the right technology and the next steps."],
        ["Can you improve an existing website or system?", "Yes. We can begin by reviewing the current experience and technical setup, then discuss focused improvements or a rebuild depending on your requirements."],
        ["Do you work with clients outside Melaka?", "Yes. KASUZAZ TECHNOLOGY is based in Melaka, Malaysia, and is available for remote projects. Communication and delivery arrangements are agreed at the start."],
        ["How are timelines and costs decided?", "They depend on the scope, content, integrations and technical complexity. These are discussed during discovery so expectations and responsibilities are clear before work begins."],
        ["What happens after launch?", "We discuss handover, maintenance, support and future improvements as part of the project scope. The exact arrangements depend on what your organisation needs."],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
    </div>
  </section>;
}
