import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Variant = "hero" | "cta" | "app";

const PALETTES = {
  dark: {
    point: new THREE.Color(0x3b82f6),
    link: new THREE.Color(0x3b82f6),
    globe: new THREE.Color(0x10b981),
    ring: new THREE.Color(0x38bdf8),
    pointOpacity: 0.85,
    linkOpacity: 0.14,
    globeOpacity: 0.32,
    ringOpacity: 0.28,
  },
  light: {
    point: new THREE.Color(0x2563eb),
    link: new THREE.Color(0x3b82f6),
    globe: new THREE.Color(0x059669),
    ring: new THREE.Color(0x0284c7),
    pointOpacity: 0.55,
    linkOpacity: 0.22,
    globeOpacity: 0.5,
    ringOpacity: 0.4,
  },
};

interface SceneState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  group: THREE.Group;
  globeGroup?: THREE.Group;
  pointsGeo: THREE.BufferGeometry;
  linkGeo: THREE.BufferGeometry;
  globeGeo?: THREE.BufferGeometry;
  ringA?: THREE.Line;
  ringB?: THREE.Line;
  nodePositions: Float32Array;
  nodePhases: Float32Array;
  nodeSpeeds: Float32Array;
  nodeBase: THREE.Vector3[];
  pointsMat: THREE.PointsMaterial;
  linksMat: THREE.LineBasicMaterial;
  globeMat?: THREE.MeshBasicMaterial;
  timer: THREE.Timer;
  opacityFactor: number;
  raf: number;
  running: boolean;
  mouse: { x: number; y: number };
}

function buildScene(container: HTMLElement, variant: Variant): SceneState {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 11;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.pointerEvents = "none";
  container.appendChild(renderer.domElement);

  const isHero = variant === "hero";
  const isApp = variant === "app";
  const radiusMin = isApp ? 5 : isHero ? 3.8 : 2.6;
  const radiusMax = isApp ? 11 : isHero ? 8.6 : 5.2;
  const count = isHero ? 280 : isApp ? 130 : 130;
  const pointSize = isHero ? 0.045 : isApp ? 0.035 : 0.035;
  const opacityFactor = isApp ? 0.75 : 1;

  /* ---- Particle constellation ---- */
  const positions = new Float32Array(count * 3);
  const base: THREE.Vector3[] = [];
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const random = (min: number, max: number) => min + Math.random() * (max - min);

  for (let i = 0; i < count; i++) {
    const r = random(radiusMin, radiusMax);
    const theta = random(0, Math.PI * 2);
    const phi = Math.acos(random(-1, 1));
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    base.push(new THREE.Vector3(x, y, z));
    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = random(0.2, 0.6);
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: PALETTES.dark.point,
    size: pointSize,
    transparent: true,
    opacity: PALETTES.dark.pointOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);

  /* ---- Static constellation links ---- */
  const linkVerts: number[] = [];
  const linkThreshold = isHero ? 1.9 : 1.5;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const a = base[i];
      const b = base[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      if (dx * dx + dy * dy + dz * dz < linkThreshold * linkThreshold) {
        linkVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
  }
  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(linkVerts), 3)
  );
  const linksMat = new THREE.LineBasicMaterial({
    color: PALETTES.dark.link,
    transparent: true,
    opacity: PALETTES.dark.linkOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const links = new THREE.LineSegments(linkGeo, linksMat);

  /* ---- Data globe (skipped for ambient "app" variant) ---- */
  let globeGroup: THREE.Group | undefined;
  let globeGeo: THREE.BufferGeometry | undefined;
  let globeMat: THREE.MeshBasicMaterial | undefined;
  let ringA: THREE.Line | undefined;
  let ringB: THREE.Line | undefined;
  let globeAnchor: THREE.Group | undefined;

  if (!isApp) {
    globeGeo = new THREE.IcosahedronGeometry(3.4, 1);
    globeMat = new THREE.MeshBasicMaterial({
      color: PALETTES.dark.globe,
      wireframe: true,
      transparent: true,
      opacity: PALETTES.dark.globeOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);

    const makeRing = (radius: number) => {
      const pts: THREE.Vector3[] = [];
      const segs = 96;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
      }
      return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: PALETTES.dark.ring,
          transparent: true,
          opacity: PALETTES.dark.ringOpacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
    };
    ringA = makeRing(4.3);
    ringB = makeRing(5.1);
    ringA.rotation.set(Math.PI / 2.4, 0.3, 0);
    ringB.rotation.set(-Math.PI / 3.2, -0.4, 0.5);

    globeGroup = new THREE.Group();
    globeGroup.add(globe, ringA, ringB);

    // Static anchor: positions/scales the globe on screen; only the inner
    // globeGroup rotates, so the globe never drifts across the layout.
    globeAnchor = new THREE.Group();
    if (isHero) {
      // Right half of the hero — left-aligned copy never overlaps it.
      globeAnchor.scale.setScalar(0.8);
      globeAnchor.position.set(6.2, -0.2, -2);
    } else {
      // CTA panel: smaller, pushed below the centered copy.
      globeAnchor.scale.setScalar(0.5);
      globeAnchor.position.set(0, -3.2, -4);
    }
    globeAnchor.add(globeGroup);
  }

  const group = new THREE.Group();
  group.add(points, links);
  scene.add(group);
  if (globeAnchor) scene.add(globeAnchor);

  const timer = new THREE.Timer();

  return {
    scene,
    camera,
    renderer,
    group,
    globeGroup,
    pointsGeo,
    linkGeo,
    globeGeo,
    ringA,
    ringB,
    nodePositions: positions,
    nodePhases: phases,
    nodeSpeeds: speeds,
    nodeBase: base,
    pointsMat,
    linksMat,
    globeMat,
    timer,
    opacityFactor,
    raf: 0,
    running: true,
    mouse: { x: 0, y: 0 },
  };
}

export default function ThreeBackground({
  variant = "hero",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneState | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = buildScene(container, variant);
    stateRef.current = state;

    const tick = () => {
      if (!state.running) return;
      state.raf = requestAnimationFrame(tick);
      state.timer.update();
      const dt = Math.min(state.timer.getDelta(), 0.05);
      const t = state.timer.getElapsed();

      const pos = state.nodePositions;
      for (let i = 0; i < state.nodeBase.length; i++) {
        const b = state.nodeBase[i];
        const drift =
          Math.sin(t * state.nodeSpeeds[i] + state.nodePhases[i]) * 0.22;
        const scale = 1 + drift / b.length();
        pos[i * 3] = b.x * scale;
        pos[i * 3 + 1] = b.y * scale;
        pos[i * 3 + 2] = b.z * scale;
      }
      (
        state.pointsGeo.attributes.position as THREE.BufferAttribute
      ).needsUpdate = true;

      state.group.rotation.y += dt * 0.05;
      if (state.globeGroup) {
        state.globeGroup.rotation.y += dt * 0.12;
        state.globeGroup.rotation.x += dt * 0.02;
      }
      if (state.ringA) state.ringA.rotation.z += dt * 0.08;
      if (state.ringB) state.ringB.rotation.z -= dt * 0.05;

      state.camera.position.x +=
        (state.mouse.x * 0.7 - state.camera.position.x) * 0.04;
      state.camera.position.y +=
        (state.mouse.y * 0.5 - state.camera.position.y) * 0.04;
      state.camera.lookAt(0, 0, 0);

      state.renderer.render(state.scene, state.camera);
    };

    if (prefersReduced) {
      state.renderer.render(state.scene, state.camera);
      state.running = false;
    } else {
      state.running = true;
      tick();
    }

    const onMouse = (e: MouseEvent) => {
      state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      state.camera.aspect = w / h;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(w, h);
    };
    const onVis = () => {
      const visible = document.visibilityState === "visible";
      if (visible && !state.running && !prefersReduced) {
        state.running = true;
        tick();
      } else if (!visible) {
        state.running = false;
      }
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      state.running = false;
      cancelAnimationFrame(state.raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      state.renderer.dispose();
      state.pointsGeo.dispose();
      state.linkGeo.dispose();
      if (state.globeGeo) state.globeGeo.dispose();
      if (state.ringA) {
        state.ringA.geometry.dispose();
        (state.ringA.material as THREE.Material).dispose();
      }
      if (state.ringB) {
        state.ringB.geometry.dispose();
        (state.ringB.material as THREE.Material).dispose();
      }
      state.pointsMat.dispose();
      state.linksMat.dispose();
      if (state.globeMat) state.globeMat.dispose();
      if (state.renderer.domElement.parentElement === container) {
        container.removeChild(state.renderer.domElement);
      }
      stateRef.current = null;
    };
  }, [variant]);

  /* Theme-aware colors */
  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    const theme = resolvedTheme === "light" ? "light" : "dark";
    const p = PALETTES[theme];
    const additive = theme === "dark";

    state.pointsMat.color.copy(p.point);
    state.pointsMat.opacity = p.pointOpacity * state.opacityFactor;
    state.pointsMat.blending = additive
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;

    state.linksMat.color.copy(p.link);
    state.linksMat.opacity = p.linkOpacity * state.opacityFactor;
    state.linksMat.blending = additive
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;

    if (state.globeMat) {
      state.globeMat.color.copy(p.globe);
      state.globeMat.opacity = p.globeOpacity;
      state.globeMat.blending = additive
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;
    }

    if (state.ringA) {
      (state.ringA.material as THREE.LineBasicMaterial).color.copy(p.ring);
      (state.ringA.material as THREE.LineBasicMaterial).opacity = p.ringOpacity;
    }
    if (state.ringB) {
      (state.ringB.material as THREE.LineBasicMaterial).color.copy(p.ring);
      (state.ringB.material as THREE.LineBasicMaterial).opacity = p.ringOpacity;
    }
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    />
  );
}
