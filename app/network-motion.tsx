"use client";

import { useEffect, useRef } from "react";

/** Decorative network; the site's explicit motion control takes precedence. */
export function NetworkMotion({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 0, height = 0, frame = 0, visible = true, tick = 0, last = 0;
    const points = Array.from({ length: 48 }, (_, i) => ({
      x: ((i * 137 + 31) % 997) / 997,
      y: ((i * 211 + 93) % 991) / 991,
      speed: .3 + (i % 5) * .14,
    }));
    const draw = (time: number) => {
      frame = 0;
      if (time - last >= 32 || paused) {
        last = time;
        if (!paused) tick += .024;
        context.clearRect(0, 0, width, height);
        const positions = points.slice(0, width < 600 ? 25 : 48).map((p) => ({
          x: ((p.x + tick * p.speed * .018) % 1) * width,
          y: (p.y * height + Math.sin(tick * p.speed + p.x * 12) * 45),
        }));
        positions.forEach((p, i) => {
          for (let j = i + 1; j < positions.length; j++) {
            const q = positions[j];
            const distance = Math.hypot(p.x - q.x, p.y - q.y);
            if (distance < 185) {
              context.strokeStyle = `rgba(74,198,255,${(1 - distance / 185) * .3})`;
              context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(q.x, q.y); context.stroke();
              if ((i + j) % 7 === 0) {
                const progress = (tick * .5 + i * .1) % 1;
                context.fillStyle = "#84edff";
                context.fillRect(p.x + (q.x - p.x) * progress, p.y + (q.y - p.y) * progress, 3, 3);
              }
            }
          }
          context.fillStyle = i % 4 === 0 ? "#6deaff" : "#4270aa";
          context.beginPath(); context.arc(p.x, p.y, i % 4 === 0 ? 2.4 : 1.3, 0, Math.PI * 2); context.fill();
        });
      }
      if (visible && !document.hidden && !paused) frame = requestAnimationFrame(draw);
    };
    const start = () => { cancelAnimationFrame(frame); frame = 0; draw(performance.now()); };
    const resize = new ResizeObserver(() => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0); start();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else cancelAnimationFrame(frame); });
    resize.observe(canvas); observer.observe(canvas);
    document.addEventListener("visibilitychange", start);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", start); };
  }, [paused]);
  return <canvas ref={ref} className="network-canvas" aria-hidden="true" />;
}

export function MotionTerminal() {
  return <div className="motion-terminal" aria-label="Animated illustration of a technology delivery workflow">
    <div className="terminal-title"><span><i /><i /><i /></span>KASUZAZ / BUILD SEQUENCE <small>ILLUSTRATION</small></div>
    <div className="terminal-lines" aria-hidden="true">
      <p><span>01</span><b>design</b> a clearer experience <i>✓</i></p>
      <p><span>02</span><b>connect</b> systems & intelligence <i>✓</i></p>
      <p><span>03</span><b>secure</b> every digital layer <i>✓</i></p>
      <p><span>04</span><b>build</b> your next possibility <i className="terminal-caret">▋</i></p>
    </div>
    <div className="terminal-progress" aria-hidden="true"><i /></div>
  </div>;
}
