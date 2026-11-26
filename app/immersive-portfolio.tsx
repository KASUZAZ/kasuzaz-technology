"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type SectionId = "projects" | "experience" | "about" | "certificates" | "contact";
type ProjectFilter = "all" | "platforms" | "security" | "systems";
type WallFrame = { position: [number, number]; size: [number, number] };
type CertificateItem = { id: string; title: string; issuer: string; file: string; preview: string; featured?: boolean; frame?: WallFrame };

const sections: { id: SectionId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

const certificates: CertificateItem[] = [
  { id: "introduction-to-cybersecurity", title: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", file: "/certificates/files/introduction-to-cybersecurity.pdf", preview: "/certificates/previews/introduction-to-cybersecurity.jpg", featured: true, frame: { position: [5.15, 4.75], size: [1.54, 1.18] } },
  { id: "cybersafe-untuk-rakyat", title: "CyberSAFE untuk Rakyat", issuer: "Ministry of Digital", file: "/certificates/files/cybersafe-untuk-rakyat.pdf", preview: "/certificates/previews/cybersafe-untuk-rakyat.jpg", featured: true, frame: { position: [6.87, 4.75], size: [1.54, 1.18] } },
  { id: "anugerah-perak-melaka-2026", title: "Anugerah Perak", issuer: "Hari Inovasi Kebangsaan @Melaka 2026", file: "/certificates/files/anugerah-perak-melaka-2026.png", preview: "/certificates/previews/anugerah-perak-melaka-2026.png", featured: true, frame: { position: [6.01, 2.95], size: [1.14, 1.66] } },
  { id: "ai-fluency", title: "AI Fluency", issuer: "Course certificate", file: "/certificates/files/ai-fluency.pdf", preview: "/certificates/previews/ai-fluency.jpg" },
  { id: "ai-safety", title: "AI Safety", issuer: "Course certificate", file: "/certificates/files/ai-safety.pdf", preview: "/certificates/previews/ai-safety.jpg" },
  { id: "blockchain", title: "Blockchain", issuer: "Course certificate", file: "/certificates/files/blockchain.pdf", preview: "/certificates/previews/blockchain.jpg" },
  { id: "python-and-html", title: "Python and HTML", issuer: "SoloLearn", file: "/certificates/files/python-and-html.pdf", preview: "/certificates/previews/python-and-html.jpg" },
  { id: "cloud-untuk-rakyat", title: "Cloud untuk Rakyat", issuer: "Course certificate", file: "/certificates/files/cloud-untuk-rakyat.pdf", preview: "/certificates/previews/cloud-untuk-rakyat.jpg" },
  { id: "computer-hardware-basics", title: "Computer Hardware Basics", issuer: "Course certificate", file: "/certificates/files/computer-hardware-basics.pdf", preview: "/certificates/previews/computer-hardware-basics.jpg" },
  { id: "creating-compelling-reports", title: "Creating Compelling Reports", issuer: "Course certificate", file: "/certificates/files/creating-compelling-reports.pdf", preview: "/certificates/previews/creating-compelling-reports.jpg" },
  { id: "generative-ai", title: "Generative AI", issuer: "Course certificate", file: "/certificates/files/generative-ai.pdf", preview: "/certificates/previews/generative-ai.jpg" },
  { id: "cisco-packet-tracer", title: "Getting Started with Cisco Packet Tracer", issuer: "Course certificate", file: "/certificates/files/cisco-packet-tracer.pdf", preview: "/certificates/previews/cisco-packet-tracer.jpg" },
  { id: "introduction-to-html", title: "Introduction to HTML", issuer: "SoloLearn", file: "/certificates/files/introduction-to-html.jpg", preview: "/certificates/previews/introduction-to-html.jpg" },
  { id: "introduction-to-iot", title: "Introduction to IoT", issuer: "Course certificate", file: "/certificates/files/introduction-to-iot.pdf", preview: "/certificates/previews/introduction-to-iot.jpg" },
  { id: "introduction-to-modern-ai", title: "Introduction to Modern AI", issuer: "Course certificate", file: "/certificates/files/introduction-to-modern-ai.pdf", preview: "/certificates/previews/introduction-to-modern-ai.jpg" },
  { id: "kasuzaz-cyber-security", title: "Cyber Security", issuer: "KASUZAZ", file: "/certificates/files/kasuzaz-cyber-security.pdf", preview: "/certificates/previews/kasuzaz-cyber-security.jpg" },
  { id: "operating-systems-basics", title: "Operating Systems Basics", issuer: "Course certificate", file: "/certificates/files/operating-systems-basics.pdf", preview: "/certificates/previews/operating-systems-basics.jpg" },
  { id: "sijil-hikm26", title: "Sijil Penghargaan HIKM26", issuer: "Karnival TVET Negeri Melaka 2026", file: "/certificates/files/sijil-hikm26.pdf", preview: "/certificates/previews/sijil-hikm26.jpg" },
  { id: "sijil-kehadiran-inovasi-2026", title: "Sijil Kehadiran", issuer: "Hari Inovasi Kebangsaan @Melaka 2026", file: "/certificates/files/sijil-kehadiran-inovasi-2026.png", preview: "/certificates/previews/sijil-kehadiran-inovasi-2026.png" },
  { id: "introduction-to-python", title: "Introduction to Python", issuer: "SoloLearn", file: "/certificates/files/introduction-to-python.jpg", preview: "/certificates/previews/introduction-to-python.jpg" },
];

const projects = [
  {
    id: "micostskills",
    name: "MiCoSTSkills",
    type: "TVET information portal",
    status: "Live website",
    category: "platforms" as const,
    description: "A structured portal bringing programmes, admissions and digital services together for the MiCoST community.",
    mark: "MS",
    tone: "mint",
    logo: "/projects/micostskills-logo.png",
    image: "/projects/micostskills.png",
    imageFit: "cover" as const,
    url: "https://micostskills.kasuzaz.my/",
  },
  {
    id: "cyberguard",
    name: "CyberGuard AI",
    type: "Cybersecurity awareness",
    status: "Live website",
    category: "security" as const,
    description: "An AI-supported learning concept for security awareness, guided practice and safer digital habits.",
    mark: "CG",
    tone: "rose",
    logo: "/projects/cyberguard-ai-logo.png",
    image: "/projects/cyberguard-ai.png",
    imageFit: "contain" as const,
    url: "https://cyberguard-ai.kasuzaz.my/",
  },
  {
    id: "fox-clan",
    name: "Fox Clan",
    type: "Community website",
    status: "Live website",
    category: "platforms" as const,
    description: "A public website for the Fox Clan community, featuring its identity and online presence.",
    mark: "FOX",
    tone: "rose",
    logo: "/projects/fox-clan-logo.png",
    image: "/projects/fox-clan.png",
    imageFit: "cover" as const,
    url: "https://fox-clan.kasuzaz.my/",
  },
  {
    id: "merlimau-kita",
    name: "Merlimau Kita",
    type: "Local community platform",
    status: "Live website",
    category: "platforms" as const,
    description: "A community focused website connecting people with Merlimau and local information.",
    mark: "MK",
    tone: "mint",
    logo: "/projects/merlimau-kita-logo.png",
    image: "/projects/merlimau-kita.png",
    imageFit: "contain" as const,
    url: "https://merlimau-kita.kasuzaz.my/",
  },
  {
    id: "exposure-hacker",
    name: "Exposure Hacker",
    type: "Cybersecurity education",
    status: "Live website",
    category: "security" as const,
    description: "A cybersecurity awareness site highlighting digital threats and safer online habits.",
    mark: "EH",
    tone: "blue",
    logo: "/projects/exposure-hacker-logo.png",
    image: "/projects/exposure-hacker.png",
    imageFit: "cover" as const,
    url: "https://exposure-hacker.kasuzaz.my/",
  },
];

const capabilities = [
  { code: "01", title: "Digital experience", subtitle: "Websites · portals · design systems", copy: "Clear, responsive interfaces that help people find what they need and take the next step.", icon: "◫" },
  { code: "02", title: "Systems & automation", subtitle: "Custom software · integrations · AI", copy: "Practical tools and connected workflows shaped around how your team already works.", icon: "⌘" },
  { code: "03", title: "Infrastructure", subtitle: "Cloud · servers · deployment", copy: "A considered technical foundation with deployment, monitoring and recovery in view.", icon: "▤" },
  { code: "04", title: "Security", subtitle: "Hardening · access · assessment", copy: "Security built into system decisions, access design and authorised reviews.", icon: "◇" },
  { code: "05", title: "Ongoing support", subtitle: "Maintenance · guidance · growth", copy: "Direct technical support to keep your digital tools useful after launch.", icon: "↗" },
];

function makeLabelTexture(THREE: typeof import("three"), title: string, subtitle: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "rgba(14, 14, 24, .88)";
  context.beginPath();
  context.roundRect(3, 3, 506, 154, 24);
  context.fill();
  context.strokeStyle = "rgba(249, 139, 179, .52)";
  context.lineWidth = 3;
  context.stroke();
  context.fillStyle = "#f58fb1";
  context.font = "600 25px Arial";
  context.fillText(subtitle.toUpperCase(), 30, 48);
  context.fillStyle = "#fff5f6";
  context.font = "600 44px Arial";
  context.fillText(title, 30, 112);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMonitorTexture(THREE: typeof import("three")) {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 760;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createLinearGradient(0, 0, 1280, 760);
  gradient.addColorStop(0, "#201e2c");
  gradient.addColorStop(0.55, "#252333");
  gradient.addColorStop(1, "#101820");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1280, 760);
  context.fillStyle = "#f58fb1";
  context.fillRect(0, 0, 1280, 8);
  context.fillStyle = "#93a9a1";
  context.font = "500 24px monospace";
  context.fillText("KASUZAZ / DIGITAL STUDIO", 80, 100);
  context.fillStyle = "#f6edf0";
  context.font = "600 94px Georgia";
  context.fillText("Ideas into", 80, 285);
  context.fillStyle = "#f58fb1";
  context.font = "italic 100px Georgia";
  context.fillText("real systems.", 80, 395);
  context.fillStyle = "#9ca6a6";
  context.font = "500 23px monospace";
  context.fillText("WEB  ·  SYSTEMS  ·  SECURITY  ·  AI", 84, 480);
  context.strokeStyle = "rgba(255,255,255,.16)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(80, 540);
  context.lineTo(1190, 540);
  context.stroke();
  context.fillStyle = "#aab8b1";
  context.font = "500 22px monospace";
  context.fillText("MELAKA, MALAYSIA", 80, 605);
  context.fillStyle = "#f58fb1";
  context.beginPath();
  context.arc(1168, 602, 9, 0, Math.PI * 2);
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function ImmersivePortfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionPausedRef = useRef(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [activeCapability, setActiveCapability] = useState(0);
  const [clock, setClock] = useState("00:00");
  const [webglFailed, setWebglFailed] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat("en-MY", { timeZone: "Asia/Kuala_Lumpur", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      motionPausedRef.current = true;
      window.requestAnimationFrame(() => setMotionPaused(true));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    let handleResize: (() => void) | undefined;
    let handleDown: ((event: PointerEvent) => void) | undefined;
    let handleMove: ((event: PointerEvent) => void) | undefined;
    let handleUp: ((event: PointerEvent) => void) | undefined;
    let handleLeave: (() => void) | undefined;
    const activeHotspots: import("three").Object3D[] = [];
    const markerRings: import("three").Mesh[] = [];
    let camera: import("three").PerspectiveCamera | undefined;
    let scene: import("three").Scene | undefined;
    const interactionState = { down: false, moved: false, x: 0, y: 0, yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 };

    import("three").then((THREE) => {
      if (disposed || !canvas) return;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        scene = new THREE.Scene();
        scene.background = new THREE.Color("#211b2b");
        scene.fog = new THREE.Fog("#211b2b", 17, 39);
        camera = new THREE.PerspectiveCamera(43, canvas.clientWidth / canvas.clientHeight, 0.1, 70);
        const lookTarget = new THREE.Vector3(0, 1.9, -1.5);
        camera.position.set(0, 2.4, 9.8);
        camera.lookAt(lookTarget);

        const ambient = new THREE.HemisphereLight("#e8c4d1", "#24202d", 2.1);
        scene.add(ambient);
        const keyLight = new THREE.DirectionalLight("#ffe1bc", 3.5);
        keyLight.position.set(-3, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        scene.add(keyLight);
        const windowLight = new THREE.PointLight("#bfcfff", 34, 17, 2);
        windowLight.position.set(0, 4.7, -4.6);
        scene.add(windowLight);
        const deskLight = new THREE.PointLight("#ff9dba", 17, 7, 2);
        deskLight.position.set(-2.4, 3.4, -0.8);
        scene.add(deskLight);

        const mat = (color: string, roughness = 0.74, metalness = 0, emissive?: string, intensity = 0.4) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...(emissive ? { emissive, emissiveIntensity: intensity } : {}) });
        const wallMat = mat("#302c3a");
        const wallTrim = mat("#464050", 0.7, 0.18);
        const dark = mat("#171721", 0.38, 0.55);
        const deskWood = mat("#4e3a3b", 0.43, 0.12);
        const rose = mat("#f58fb1", 0.34, 0.25, "#d93a77", 0.55);
        const brass = mat("#b99979", 0.34, 0.58);
        const box = (parent: import("three").Object3D, size: [number, number, number], position: [number, number, number], material: import("three").Material, cast = true) => {
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
          mesh.position.set(...position);
          mesh.castShadow = cast;
          mesh.receiveShadow = true;
          parent.add(mesh);
          return mesh;
        };

        // A warmly lit, compact studio with a large window onto Melaka at dusk.
        const room = new THREE.Group();
        scene.add(room);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 23), mat("#211e2a", 0.83, 0.15));
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, -2);
        floor.receiveShadow = true;
        room.add(floor);
        const rug = new THREE.Mesh(new THREE.PlaneGeometry(13, 7), mat("#292433", 0.98));
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(0, 0.018, 0.6);
        room.add(rug);
        box(room, [18, 8, 0.35], [0, 4, -6], wallMat, false);
        box(room, [0.35, 8, 14], [-9, 4, 0], wallMat, false);
        box(room, [0.35, 8, 14], [9, 4, 0], wallMat, false);
        box(room, [18, 0.35, 14], [0, 8, 0], mat("#211d29"), false);
        box(room, [18, 0.12, 0.2], [0, 0.1, -5.72], wallTrim, false);

        // Rear window and stylised city silhouette.
        box(room, [8.7, 4.1, 0.14], [0, 4.25, -5.78], dark, false);
        const sky = new THREE.Mesh(new THREE.PlaneGeometry(8.34, 3.72), new THREE.MeshBasicMaterial({ color: "#82738d" }));
        sky.position.set(0, 4.25, -5.68);
        room.add(sky);
        const skyline = new THREE.Group();
        room.add(skyline);
        const buildingColors = ["#493f54", "#594961", "#46445b", "#5b4b63", "#363a51"];
        for (let i = 0; i < 15; i += 1) {
          const width = 0.42 + ((i * 17) % 5) * 0.13;
          const height = 0.8 + ((i * 29) % 9) * 0.22;
          const x = -4 + i * 0.56;
          const building = box(skyline, [width, height, 0.3], [x, 2.42 + height / 2, -5.52], mat(buildingColors[i % buildingColors.length]), false);
          building.castShadow = false;
          for (let row = 0; row < Math.floor(height * 2.5); row += 1) {
            for (let col = 0; col < Math.max(1, Math.floor(width * 4)); col += 1) {
              if ((i * 7 + row * 3 + col * 11) % 4 !== 0) continue;
              const lit = new THREE.Mesh(new THREE.PlaneGeometry(0.042, 0.06), new THREE.MeshBasicMaterial({ color: (row + col + i) % 3 ? "#d6b99a" : "#93a4b9" }));
              lit.position.set(x - width / 2 + 0.1 + col * 0.12, 2.55 + row * 0.16, -5.32);
              skyline.add(lit);
            }
          }
        }
        box(room, [0.12, 4.3, 0.18], [0, 4.25, -5.52], wallTrim, false);
        box(room, [8.8, 0.12, 0.18], [0, 4.24, -5.52], wallTrim, false);
        box(room, [8.8, 0.14, 0.18], [0, 2.15, -5.52], wallTrim, false);
        box(room, [0.16, 4.4, 0.18], [-4.35, 4.25, -5.52], wallTrim, false);
        box(room, [0.16, 4.4, 0.18], [4.35, 4.25, -5.52], wallTrim, false);

        // Wall panel seams, a floating shelf, books and framed K mark.
        for (let x = -8; x <= 8; x += 1.65) box(room, [0.025, 7.7, 0.025], [x, 4, -5.78], wallTrim, false);
        box(room, [3.4, 0.13, 0.55], [6.1, 5.45, -5.42], deskWood);
        const bookMats = [mat("#8b5669"), mat("#758a86"), mat("#bf9875"), mat("#464f69"), mat("#c7b394")];
        for (let i = 0; i < bookMats.length; i += 1) {
          const book = box(room, [0.22, 0.74 + (i % 2) * 0.12, 0.36], [5.0 + i * 0.27, 5.87 + (i % 2) * 0.06, -5.42], bookMats[i]);
          book.rotation.z = (i % 2 ? 1 : -1) * 0.035;
        }
        box(room, [0.09, 1.05, 0.12], [7.04, 6.02, -5.4], brass);
        box(room, [0.78, 0.09, 0.12], [7.38, 6.53, -5.4], brass);

        // Desk and furniture.
        const desk = new THREE.Group();
        scene.add(desk);
        box(desk, [9.5, 0.3, 3.2], [0, 1.45, 0], deskWood);
        box(desk, [9.35, 0.09, 3.05], [0, 1.64, 0], mat("#765658", 0.38, 0.18));
        for (const x of [-4.25, 4.25]) for (const z of [-1.15, 1.15]) box(desk, [0.18, 1.42, 0.18], [x, 0.68, z], dark);
        box(desk, [6.7, 0.06, 2.2], [-0.1, 1.72, -0.06], mat("#292632", 0.96));
        // Monitor chassis, stand and luminous interface.
        box(desk, [4.65, 2.85, 0.25], [0, 3.48, -1.65], dark);
        box(desk, [4.46, 2.66, 0.04], [0, 3.49, -1.49], mat("#151720", 0.25, 0.24, "#f58fb1", 0.08));
        const monitorTexture = makeMonitorTexture(THREE);
        const monitorScreen = new THREE.Mesh(new THREE.PlaneGeometry(4.35, 2.56), new THREE.MeshBasicMaterial({ map: monitorTexture ?? undefined, color: monitorTexture ? "#ffffff" : "#252333" }));
        monitorScreen.position.set(0, 3.49, -1.455);
        monitorScreen.userData.section = "projects";
        monitorScreen.userData.hotspot = true;
        desk.add(monitorScreen);
        activeHotspots.push(monitorScreen);
        box(desk, [0.55, 1.1, 0.35], [0, 1.98, -1.65], brass);
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 1.1, 0.12, 32), dark);
        stand.position.set(0, 1.76, -1.65);
        desk.add(stand);
        // Keyboard, mouse, tablet and coffee cup.
        box(desk, [2.6, 0.1, 0.74], [0.08, 1.82, 0.7], dark);
        for (let row = 0; row < 4; row += 1) for (let col = 0; col < 14; col += 1) box(desk, [0.14, 0.04, 0.1], [-1.1 + col * 0.18, 1.89, 0.43 + row * 0.16], mat((row + col) % 7 === 0 ? "#bd7790" : "#72717f", 0.48, 0.16));
        const mouse = new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 12), dark);
        mouse.scale.set(1.3, 0.55, 1.65);
        mouse.position.set(2.0, 1.88, 0.66);
        desk.add(mouse);
        box(desk, [1.0, 0.08, 1.24], [-3.0, 1.79, 0.58], brass);
        box(desk, [0.89, 0.06, 1.12], [-3.0, 1.84, 0.58], mat("#b5a791", 0.72));
        const tabletLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.98), new THREE.MeshBasicMaterial({ map: makeMonitorTexture(THREE) ?? undefined }));
        tabletLabel.position.set(-3.0, 1.879, 0.58);
        tabletLabel.rotation.x = -Math.PI / 2;
        desk.add(tabletLabel);
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.5, 24), mat("#dfc8b1", 0.3));
        cup.position.set(3.6, 1.99, 0.6);
        desk.add(cup);
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.045, 8, 18), brass);
        handle.position.set(3.86, 2.02, 0.6);
        desk.add(handle);

        // Contact phone on a small stand; this is a clickable marker.
        const phone = new THREE.Group();
        phone.position.set(3.55, 2.05, -0.66);
        phone.rotation.y = -0.22;
        desk.add(phone);
        box(phone, [0.88, 1.48, 0.11], [0, 0.73, 0], dark);
        const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.27), mat("#241d2d", 0.24, 0.08, "#f58fb1", 0.4));
        phoneScreen.position.set(0, 0.75, 0.064);
        phoneScreen.userData.section = "contact";
        phoneScreen.userData.hotspot = true;
        phone.add(phoneScreen);
        activeHotspots.push(phoneScreen);
        box(phone, [1.2, 0.12, 1.45], [0, 0.06, 0.18], brass);

        // A profile portrait and three featured certificate frames on the side wall.
        const portrait = new THREE.Group();
        portrait.position.set(-6.75, 4.5, -5.55);
        scene.add(portrait);
        box(portrait, [1.55, 2.1, 0.18], [0, 0, 0], brass);
        box(portrait, [1.35, 1.88, 0.06], [0, 0, 0.1], dark);
        const portraitTexture = new THREE.TextureLoader().load("/aizul-haziq-profile.png");
        portraitTexture.colorSpace = THREE.SRGBColorSpace;
        const portraitMark = new THREE.Mesh(
          new THREE.PlaneGeometry(1.22, 1.42),
          new THREE.MeshBasicMaterial({ map: portraitTexture, toneMapped: false }),
        );
        portraitMark.position.set(0, 0.14, 0.14);
        portraitMark.userData.section = "about";
        portraitMark.userData.hotspot = true;
        portrait.add(portraitMark);
        activeHotspots.push(portraitMark);
        const certificateTextureLoader = new THREE.TextureLoader();
        for (const certificate of certificates) {
          if (!certificate.frame) continue;
          const [width, height] = certificate.frame.size;
          const frame = new THREE.Group();
          frame.position.set(certificate.frame.position[0], certificate.frame.position[1], -5.55);
          scene.add(frame);
          box(frame, [width, height, 0.18], [0, 0, 0], brass);
          box(frame, [width - 0.14, height - 0.14, 0.06], [0, 0, 0.1], dark);
          const texture = certificateTextureLoader.load(certificate.preview);
          texture.colorSpace = THREE.SRGBColorSpace;
          const face = new THREE.Mesh(
            new THREE.PlaneGeometry(width - 0.24, height - 0.28),
            new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
          );
          face.position.z = 0.14;
          face.userData.section = "certificates";
          face.userData.hotspot = true;
          frame.add(face);
          activeHotspots.push(face);
        }

        // Hanging warm bulbs, plant and a few floating dust motes add depth to the room.
        for (let i = 0; i < 8; i += 1) {
          const x = -7 + i * 2;
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), mat("#ffd5ad", 0.2, 0, "#ffad82", 2.3));
          bulb.position.set(x, 6.85 - Math.sin(i / 7 * Math.PI) * 0.8, -5.45);
          room.add(bulb);
          const point = new THREE.PointLight("#ffb797", 1.4, 2.3, 2);
          point.position.copy(bulb.position);
          room.add(point);
        }
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.65, 18), mat("#846c65"));
        pot.position.set(-6.2, 0.45, -1.85);
        room.add(pot);
        for (let i = 0; i < 7; i += 1) {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), mat(i % 2 ? "#506a61" : "#748174", 0.85));
          leaf.position.set(-6.2 + Math.cos(i * 0.9) * 0.42, 1.28 + (i % 3) * 0.24, -1.85 + Math.sin(i * 0.9) * 0.34);
          leaf.scale.set(0.44, 1.05, 0.4);
          leaf.rotation.z = Math.cos(i) * 0.4;
          room.add(leaf);
        }
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(90 * 3);
        for (let i = 0; i < 90; i += 1) {
          dustPositions[i * 3] = (Math.random() - 0.5) * 12;
          dustPositions[i * 3 + 1] = 0.5 + Math.random() * 5;
          dustPositions[i * 3 + 2] = -4 + Math.random() * 9;
        }
        dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
        const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: "#efd6d6", size: 0.025, transparent: true, opacity: 0.45 }));
        scene.add(dust);

        // Floating markers double as mouse/touch hotspots and as visual invitations.
        const markerSpecs: { id: SectionId; pos: [number, number, number] }[] = [
          { id: "projects", pos: [-2.7, 3.05, -0.65] },
          { id: "experience", pos: [5.6, 4.55, -4.95] },
          { id: "about", pos: [-6.0, 3.25, -4.9] },
          { id: "certificates", pos: [7.7, 3.0, -4.8] },
          { id: "contact", pos: [3.7, 3.05, -0.2] },
        ];
        const openByMarker = (id: SectionId) => {
          setActiveSection(id);
          window.history.replaceState(null, "", `#${id}`);
        };
        for (const marker of markerSpecs) {
          const group = new THREE.Group();
          group.position.set(...marker.pos);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 10, 32), rose);
          ring.userData.section = marker.id;
          ring.userData.hotspot = true;
          group.add(ring);
          const core = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), mat("#ffe0e8", 0.18, 0.1, "#f04483", 1.6));
          core.userData.section = marker.id;
          core.userData.hotspot = true;
          group.add(core);
          const texture = makeLabelTexture(THREE, marker.id[0].toUpperCase() + marker.id.slice(1), "open section");
          if (texture) {
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
            sprite.scale.set(marker.id === "certificates" ? 1.55 : 1.9, marker.id === "certificates" ? 0.49 : 0.6, 1);
            sprite.position.y = 0.47;
            sprite.userData.section = marker.id;
            sprite.userData.hotspot = true;
            group.add(sprite);
          }
          scene.add(group);
          markerRings.push(ring);
          activeHotspots.push(group);
          group.userData.open = () => openByMarker(marker.id);
        }

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const hitTest = (event: PointerEvent) => {
          const rect = canvas.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera!);
          return raycaster.intersectObjects(activeHotspots, true).find((hit) => hit.object.userData.section);
        };
        handleDown = (event) => {
          interactionState.down = true;
          interactionState.moved = false;
          interactionState.x = event.clientX;
          interactionState.y = event.clientY;
          canvas.setPointerCapture(event.pointerId);
        };
        handleMove = (event) => {
          if (interactionState.down) {
            const dx = event.clientX - interactionState.x;
            const dy = event.clientY - interactionState.y;
            if (Math.abs(dx) + Math.abs(dy) > 3) interactionState.moved = true;
            interactionState.targetYaw = THREE.MathUtils.clamp(interactionState.targetYaw - dx * 0.0032, -0.72, 0.72);
            interactionState.targetPitch = THREE.MathUtils.clamp(interactionState.targetPitch + dy * 0.0015, -0.22, 0.18);
            interactionState.x = event.clientX;
            interactionState.y = event.clientY;
          } else {
            canvas.style.cursor = hitTest(event) ? "pointer" : "grab";
          }
        };
        handleUp = (event) => {
          if (interactionState.down && !interactionState.moved) {
            const hit = hitTest(event);
            const section = hit?.object.userData.section as SectionId | undefined;
            if (section) openByMarker(section);
          }
          interactionState.down = false;
        };
        handleLeave = () => { interactionState.down = false; };
        canvas.addEventListener("pointerdown", handleDown);
        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("pointerup", handleUp);
        canvas.addEventListener("pointercancel", handleLeave);
        handleResize = () => {
          if (!canvas || !renderer || !camera) return;
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          camera.aspect = width / Math.max(1, height);
          camera.fov = width < 700 ? 51 : 43;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 700 ? 1.3 : 1.7));
          renderer.setSize(width, height, false);
        };
        observer = new ResizeObserver(handleResize);
        observer.observe(canvas);
        handleResize();
        setWebglFailed(false);

        const clock = new THREE.Clock();
        const animate = () => {
          if (disposed || !renderer || !scene || !camera) return;
          frame = window.requestAnimationFrame(animate);
          const elapsed = clock.getElapsedTime();
          if (!motionPausedRef.current) {
            interactionState.yaw += (interactionState.targetYaw - interactionState.yaw) * 0.055;
            interactionState.pitch += (interactionState.targetPitch - interactionState.pitch) * 0.055;
            camera.position.x = Math.sin(interactionState.yaw) * 9.8;
            camera.position.y = 2.45 + interactionState.pitch * 3;
            camera.position.z = Math.cos(interactionState.yaw) * 9.8;
            camera.lookAt(lookTarget.x, lookTarget.y + interactionState.pitch * 0.35, lookTarget.z);
            markerRings.forEach((ring, index) => {
              const pulse = 1 + Math.sin(elapsed * 2.2 + index * 1.4) * 0.12;
              ring.scale.setScalar(pulse);
            });
            dust.rotation.y = elapsed * 0.012;
          }
          renderer.render(scene, camera);
        };
        animate();
      } catch {
        setWebglFailed(true);
      }
    }).catch(() => setWebglFailed(true));

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (canvas && handleDown) canvas.removeEventListener("pointerdown", handleDown);
      if (canvas && handleMove) canvas.removeEventListener("pointermove", handleMove);
      if (canvas && handleUp) canvas.removeEventListener("pointerup", handleUp);
      if (canvas && handleLeave) {
        canvas.removeEventListener("pointercancel", handleLeave);
        canvas.removeEventListener("pointerleave", handleLeave);
      }
      scene?.traverse((object) => {
        if (!("geometry" in object) || !("material" in object)) return;
        const drawable = object as import("three").Mesh;
        if (!("geometry" in drawable) || !drawable.geometry) return;
        drawable.geometry.dispose();
        const materials = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
        materials.forEach((material) => {
          const texturable = material as import("three").Material & { map?: import("three").Texture };
          texturable.map?.dispose();
          material.dispose();
        });
      });
      renderer?.dispose();
    };
  }, []);

  const openSection = (id: SectionId) => {
    setActiveSection(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const closeSection = () => {
    setActiveSection(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      setActiveSection(sections.some((item) => item.id === id) ? id as SectionId : null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSection();
      if (activeSection === "experience" && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        setActiveCapability((current) => (current + (event.key === "ArrowRight" ? 1 : capabilities.length - 1)) % capabilities.length);
      }
    };
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("keydown", onKeyDown);
    syncHash();
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeSection]);

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const selectedProject = projects.find((project) => project.id === activeProject) ?? projects[0];
  const capability = capabilities[activeCapability];

  return (
    <main className="immersive-site" data-motion={motionPaused ? "paused" : "live"}>
      <canvas ref={canvasRef} className="immersive-canvas" aria-label="Interactive 3D Kasuzaz studio. Drag to look around; click a glowing marker or section menu." />
      {webglFailed && <div className="webgl-note" role="status">Interactive 3D is unavailable on this device. Use the section menu below to explore Kasuzaz.</div>}

      <a className="immersive-brand" href="#" onClick={(event) => { event.preventDefault(); closeSection(); }} aria-label="KASUZAZ Technology, return to studio">
        <Image src="/kasuzaz-technology-logo.png" alt="" width={56} height={56} priority />
        <span><strong>KASUZAZ</strong><small>TECHNOLOGY · MELAKA</small></span>
      </a>

      <div className="immersive-clock"><i /> MELAKA, MALAYSIA <b>·</b> {clock} MYT</div>
      <button className="motion-toggle" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused((paused) => { motionPausedRef.current = !paused; return !paused; })}>{motionPaused ? "RESUME MOTION" : "PAUSE MOTION"}<span>{motionPaused ? "▶" : "Ⅱ"}</span></button>

      {activeSection ? (
        <>
          <div className="immersive-dimmer" onClick={closeSection} aria-hidden="true" />
          <button className="back-to-room" type="button" onClick={closeSection}><span>←</span> BACK TO THE ROOM</button>
          <section className={`content-terminal terminal-${activeSection}`} aria-labelledby="section-heading">
            <div className="terminal-bar"><span className="terminal-lights"><i /><i /><i /></span><span>KASUZAZ / {activeSection.toUpperCase()}</span><span className="terminal-clock">{clock} MYT</span></div>
            {activeSection === "projects" && (
              <div className="terminal-content projects-content">
                <header className="section-intro"><p>01 / SELECTED WORK</p><h1 id="section-heading">Projects</h1><span>Ideas made useful.</span></header>
                <div className="project-filters" aria-label="Filter projects">
                  {(["all", "platforms", "security", "systems"] as ProjectFilter[]).map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => { setFilter(item); const first = item === "all" ? projects[0] : projects.find((project) => project.category === item); if (first) setActiveProject(first.id); }}><small>{item === "all" ? "0" : String(projects.filter((project) => project.category === item).length).padStart(2, "0")}</small>{item}</button>)}
                </div>
                <div className="project-browser">
                  <div className="project-list" role="listbox" aria-label="Selected Kasuzaz projects">
                    {filteredProjects.map((project) => <button key={project.id} type="button" className={`project-row ${activeProject === project.id ? "is-selected" : ""}`} aria-selected={activeProject === project.id} role="option" onClick={() => setActiveProject(project.id)}>
                      <span className={`project-mark mark-${project.tone}`}><Image className="project-mark-image" src={project.logo} alt="" fill sizes="(max-width: 700px) 31px, 42px" /></span><span className="project-row-copy"><strong>{project.name}</strong><small>{project.type}</small></span><span className="project-row-arrow">↗</span>
                    </button>)}
                  </div>
                  <article className="project-detail" key={selectedProject.id}>
                    <div className={`project-art art-${selectedProject.tone}`}><Image className={`project-art-image image-${selectedProject.imageFit}`} src={selectedProject.image} alt={`${selectedProject.name} website preview`} fill sizes="(max-width: 700px) 90vw, 55vw" /><div className="project-art-shade" /><small>KASUZAZ / PROJECT 0{projects.indexOf(selectedProject) + 1}</small></div>
                    <p className="project-type">{selectedProject.type}</p><h2>{selectedProject.name}</h2><p className="project-description">{selectedProject.description}</p><span className="project-status"><i /> {selectedProject.status}</span><a className="text-cta" href={selectedProject.url} target="_blank" rel="noreferrer">Visit website <span>↗</span></a><a className="text-cta project-discuss-link" href="#contact" onClick={() => openSection("contact")}>Discuss a similar project <span>↗</span></a>
                  </article>
                </div>
              </div>
            )}
            {activeSection === "experience" && (
              <div className="terminal-content experience-content">
                <header className="section-intro"><p>02 / CAPABILITIES</p><h1 id="section-heading">Experience</h1><span>One connected technology partner.</span></header>
                <div className="experience-layout">
                  <div className="experience-visual"><div className={`experience-glyph glyph-${activeCapability}`}><span>{capability.icon}</span><i /><i /><i /></div><small>CAPABILITY / {capability.code}</small></div>
                  <article className="experience-detail"><p>{capability.code} / KASUZAZ TECHNOLOGY</p><h2>{capability.title}</h2><span className="experience-subtitle">{capability.subtitle}</span><p className="experience-copy">{capability.copy}</p><a className="text-cta" href="#contact" onClick={() => openSection("contact")}>Talk about your needs <span>↗</span></a></article>
                </div>
                <div className="badge-controls"><button type="button" aria-label="Previous capability" onClick={() => setActiveCapability((activeCapability + capabilities.length - 1) % capabilities.length)}>←</button><span>{capability.code} <i>/</i> {String(capabilities.length).padStart(2, "0")}</span><button type="button" aria-label="Next capability" onClick={() => setActiveCapability((activeCapability + 1) % capabilities.length)}>→</button></div>
              </div>
            )}
            {activeSection === "about" && (
              <div className="terminal-content about-content">
                <header className="section-intro"><p>03 / THE STUDIO</p><h1 id="section-heading">About</h1><span>Local roots. Connected thinking.</span></header>
                <div className="about-layout"><div className="founder-card"><div className="founder-avatar"><Image src="/aizul-haziq-profile.png" alt="Muhammad Aizul Haziq" fill sizes="(max-width: 520px) 74px, 118px" /><span aria-hidden="true">↗</span></div><small>FOUNDER / LEAD TECHNOLOGIST</small><strong>Muhammad Aizul Haziq</strong><span>Melaka, Malaysia</span><div className="founder-lines"><i /><i /><i /></div></div><div className="about-copy"><p className="about-lead">Technology should solve a real problem, stay secure and grow with the people who use it.</p><p>KASUZAZ TECHNOLOGY is an independent technology studio turning practical ideas into structured digital systems. We bring web engineering, system administration, networking, design, cybersecurity and AI thinking into one focused delivery process.</p><div className="principle-grid"><span><i>01</i> Integrity</span><span><i>02</i> Security</span><span><i>03</i> Innovation</span><span><i>04</i> Clarity</span></div><a className="text-cta certificate-link" href="#certificates" onClick={() => openSection("certificates")}>View all certificates <span>↗</span></a></div></div>
              </div>
            )}
            {activeSection === "certificates" && (
              <div className="terminal-content certificates-content">
                <header className="section-intro"><p>04 / LEARNING &amp; RECOGNITION</p><h1 id="section-heading">Certificates</h1><span>Highlights from my learning and work.</span></header>
                <p className="certificates-note">All {certificates.length} certificates are available here. Select a preview to open the full document.</p>
                <div className="certificates-grid">
                  {certificates.map((certificate) => (
                    <article className={`certificate-card${certificate.featured ? " is-featured" : ""}`} key={certificate.id}>
                      <a className="certificate-preview" href={certificate.file} target="_blank" rel="noreferrer" aria-label={`Open ${certificate.title}`}>
                        <Image src={certificate.preview} alt="" fill sizes="(max-width: 520px) 85vw, (max-width: 820px) 42vw, 28vw" />
                        <span>OPEN ↗</span>
                      </a>
                      <div className="certificate-card-info">
                        <p>{certificate.featured ? "FEATURED CERTIFICATE" : certificate.issuer}</p>
                        <h2>{certificate.title}</h2>
                        <a href={certificate.file} target="_blank" rel="noreferrer">View full certificate <span>↗</span></a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {activeSection === "contact" && (
              <div className="terminal-content contact-content">
                <header className="section-intro"><p>05 / LET&apos;S CONNECT</p><h1 id="section-heading">Contact</h1><span>Have a project in mind? Start a conversation.</span></header>
                <div className="contact-layout"><div className="contact-phone"><div className="phone-speaker" /><div className="phone-time">{clock}<small>MYT · MELAKA</small></div><Image src="/kasuzaz-technology-logo.png" alt="KASUZAZ Technology" width={70} height={70} /><strong>KASUZAZ<br />TECHNOLOGY</strong><span>Secure. Build. Transform.</span><a className="phone-message" href="https://wa.me/601124819812" target="_blank" rel="noreferrer">Message on WhatsApp <b>↗</b></a></div><div className="contact-details"><p>DIRECT CONTACT</p><a className="contact-link" href="mailto:aizul@kasuzaz.my"><span>EMAIL</span><strong>aizul@kasuzaz.my</strong><i>↗</i></a><a className="contact-link" href="tel:+601124819812"><span>PHONE</span><strong>+60 11-2481 9812</strong><i>↗</i></a><a className="contact-link" href="https://wa.me/601124819812" target="_blank" rel="noreferrer"><span>WHATSAPP</span><strong>Start a project chat</strong><i>↗</i></a><div className="contact-location"><i /> MELAKA, MALAYSIA · REMOTE WORLDWIDE</div><div className="social-links"><a href="https://github.com/KASUZAZ" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.instagram.com/kasuzaz_" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://www.tiktok.com/@kasuzaztech" target="_blank" rel="noreferrer">TIKTOK ↗</a></div></div></div>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="welcome-note"><span>INTERACTIVE DIGITAL STUDIO</span><strong>Welcome to<br /><em>KASUZAZ.</em></strong><p>Drag to look around. Select a section, or tap a glowing marker in the room.</p><button type="button" onClick={() => openSection("projects")}>ENTER THE STUDIO <span>↓</span></button></div>
      )}

      <nav className="section-dock" aria-label="Sections">
        {sections.map((section, index) => <button key={section.id} type="button" className={activeSection === section.id ? "is-active" : ""} aria-current={activeSection === section.id ? "page" : undefined} onClick={() => openSection(section.id)}><span>0{index + 1}</span>{section.label}</button>)}
      </nav>
      <div className="room-credit"><span>DESIGNED & BUILT IN MELAKA</span><i /> KASUZAZ.MY</div>
    </main>
  );
}
