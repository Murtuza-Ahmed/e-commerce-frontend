import { useEffect, useRef } from "react";
import type {
  WebGLRenderer,
  PlaneGeometry,
  MeshPhysicalMaterial,
  BufferGeometry,
  PointsMaterial,
  BufferAttribute,
} from "three";

/**
 * FabricHero — flowing gold silk waves (Three.js) for the night-suit storefront.
 *
 * SSR-safe: `three` is dynamically imported inside useEffect, so the
 * prerender only renders the gradient fallback div — no window/document
 * access at module scope or during render. Pauses when the tab is hidden
 * or the hero scrolls out of view; reduced-motion users get one static frame.
 */
export function FabricHero({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let raf = 0;
    let renderer: WebGLRenderer | null = null;
    let geometry: PlaneGeometry | null = null;
    let material: MeshPhysicalMaterial | null = null;
    let pointsGeo: BufferGeometry | null = null;
    let pointsMat: PointsMaterial | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const segX = isMobile ? 40 : 72;
    const segY = isMobile ? 28 : 44;

    const mouse = { x: 0, y: 0 };
    let inView = true;

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    container.addEventListener("pointermove", onPointer);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(container);

    import("three").then((THREE) => {
      if (disposed) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x050505, 10, 20);

      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
      camera.position.set(0, 1.1, 8.5);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h || !renderer) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // Lights — warm gold on dark
      scene.add(new THREE.HemisphereLight(0xfff3d6, 0x14100a, 0.9));
      const key = new THREE.DirectionalLight(0xffe0a3, 1.8);
      key.position.set(4, 6, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x8a6d2b, 0.9);
      rim.position.set(-5, -2, 4);
      scene.add(rim);

      // The fabric: a silk sheet with sheen, rippled like cloth in a breeze
      const group = new THREE.Group();
      scene.add(group);
      geometry = new THREE.PlaneGeometry(15, 9, segX, segY);
      material = new THREE.MeshPhysicalMaterial({
        color: 0xc9a227,
        metalness: 0.1,
        roughness: 0.55,
        sheen: 1,
        sheenColor: new THREE.Color(0xffe6b0),
        sheenRoughness: 0.5,
        side: THREE.DoubleSide,
      });
      const fabric = new THREE.Mesh(geometry, material);
      fabric.rotation.x = -0.95;
      fabric.position.set(0, -1.7, -1);
      group.add(fabric);

      // Gold dust particles drifting above the fabric
      const COUNT = 220;
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = Math.random() * 6 - 1;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      pointsMat = new THREE.PointsMaterial({
        color: 0xffb238,
        size: 0.06,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dust = new THREE.Points(pointsGeo, pointsMat);
      group.add(dust);

      const base = (geometry.attributes.position.array as Float32Array).slice();
      const clock = new THREE.Clock();

      const draw = (t: number) => {
        const pos = geometry!.attributes.position as BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          const x = base[i * 3];
          const y = base[i * 3 + 1];
          pos.setZ(i, Math.sin(x * 0.45 + t * 0.9) * 0.35 + Math.cos(y * 0.6 + t * 0.6) * 0.28);
        }
        pos.needsUpdate = true;
        geometry!.computeVertexNormals();

        const p = pointsGeo!.attributes.position as BufferAttribute;
        for (let i = 0; i < p.count; i++) {
          let y = p.getY(i) + 0.0035;
          if (y > 5) y = -1;
          p.setY(i, y);
        }
        p.needsUpdate = true;

        group.rotation.y += (mouse.x * 0.18 - group.rotation.y) * 0.04;
        group.rotation.x += (-mouse.y * 0.08 - group.rotation.x) * 0.04;
        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;

        renderer!.render(scene, camera);
      };

      if (reducedMotion) {
        draw(0.6);
        return;
      }

      const tick = () => {
        if (disposed) return;
        raf = requestAnimationFrame(tick);
        if (document.hidden || !inView) return;
        draw(clock.getElapsedTime());
      };
      tick();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onPointer);
      io.disconnect();
      resizeObserver?.disconnect();
      geometry?.dispose();
      material?.dispose();
      pointsGeo?.dispose();
      pointsMat?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} aria-hidden="true">
      {/* Gradient fallback — visible during SSR/prerender and before WebGL starts */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,#3d2c10_0%,#14100a_45%,#050505_100%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
