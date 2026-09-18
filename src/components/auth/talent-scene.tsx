import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Decorative career pathways. No employee data is encoded in this scene. */
export default function TalentScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const css = getComputedStyle(container);
    const color = (token: string) =>
      new THREE.Color(
        `hsl(${css.getPropertyValue(token).trim().replace(/\s+/g, ", ")})`,
      );
    const blue = color("--scene-blue");
    const mint = color("--scene-mint");
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.5, 12);
    camera.lookAt(0, 0, 0);
    const group = new THREE.Group();
    group.rotation.set(-0.15, 0, -0.28);
    scene.add(group);
    scene.add(new THREE.AmbientLight(blue, 2));
    const key = new THREE.DirectionalLight(
      new THREE.Color("hsl(215, 40%, 96%)"),
      5,
    );
    key.position.set(-3, 5, 5);
    scene.add(key);
    const fill = new THREE.PointLight(mint, 30);
    fill.position.set(3, 0, 3);
    scene.add(fill);
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const sphere = new THREE.SphereGeometry(0.16, 20, 16);
    geometries.push(sphere);
    const material = new THREE.MeshStandardMaterial({
      color: blue,
      metalness: 0.65,
      roughness: 0.22,
    });
    const growthMaterial = new THREE.MeshStandardMaterial({
      color: mint,
      metalness: 0.45,
      roughness: 0.2,
      emissive: mint,
      emissiveIntensity: 0.13,
    });
    materials.push(material, growthMaterial);
    for (let strand = 0; strand < 3; strand++) {
      const points = Array.from({ length: 81 }, (_, index) => {
        const t = index / 80;
        const angle = t * Math.PI * 2.1 + (strand * Math.PI * 2) / 3;
        const radius = 1.45 + Math.sin(t * Math.PI) * 0.4;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          (t - 0.5) * 4.5,
          Math.sin(angle) * radius,
        );
      });
      const path = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(path, 90, 0.026, 6, false);
      const mat = new THREE.MeshStandardMaterial({
        color: strand === 2 ? mint : blue,
        metalness: 0.5,
        roughness: 0.35,
        transparent: true,
        opacity: 0.65,
      });
      geometries.push(geometry);
      materials.push(mat);
      group.add(new THREE.Mesh(geometry, mat));
      for (let n = 0; n < 6; n++) {
        const node = new THREE.Mesh(
          sphere,
          strand === 2 ? growthMaterial : material,
        );
        node.position.copy(path.getPoint(n / 5));
        node.scale.setScalar(n === 5 ? 1.55 : 1);
        group.add(node);
      }
    }
    // Cross-links connect neighboring career paths, rather than a random starfield.
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const y = (t - 0.5) * 4.5;
      const angle = t * Math.PI * 2.1;
      const radius = 1.45 + Math.sin(t * Math.PI) * 0.4;
      const points = [0, 1, 2, 0].map(
        (s) =>
          new THREE.Vector3(
            Math.cos(angle + (s * Math.PI * 2) / 3) * radius,
            y,
            Math.sin(angle + (s * Math.PI * 2) / 3) * radius,
          ),
      );
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: blue,
        transparent: true,
        opacity: 0.17,
      });
      geometries.push(geometry);
      materials.push(mat);
      group.add(new THREE.Line(geometry, mat));
    }
    let frame = 0;
    let visible = true;
    let lost = false;
    let last = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const draw = () => renderer.render(scene, camera);
    const tick = (time: number) => {
      if (lost || !visible || document.hidden || reduced.matches) {
        frame = 0;
        return;
      }
      if (time - last >= 32) {
        group.rotation.y = time * 0.00007;
        draw();
        last = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (lost) return;
      draw();
      if (visible && !document.hidden && !reduced.matches)
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      draw();
    };
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(container);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    observer.observe(container);
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      container.dataset.ready = "false";
    };
    const onRestored = () => {
      lost = false;
      container.dataset.ready = "true";
      resize();
      resume();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored);
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", resume);
    resize();
    resume();
    container.dataset.ready = "true";
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", resume);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onRestored,
      );
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="talent-canvas" aria-hidden="true" />;
}
