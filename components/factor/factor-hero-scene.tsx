'use client';

// Ambient 3D backdrop for the Factor hero: a slow constellation of wireframe
// desktop windows with two glowing cursors — sky (Factor) and orange (you) —
// weaving between them. Pauses offscreen, respects reduced motion, caps DPR,
// and disposes everything on unmount.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SKY = 0x0ea5e9;
const SKY_DEEP = 0x0369a1;
const SURFACE = 0x08182b;

function makeGlowTexture(hex: string) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, `${hex}ff`);
    g.addColorStop(0.35, `${hex}66`);
    g.addColorStop(1, `${hex}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// A desktop window as pure line work: outer frame + title-bar rule.
function makeWindow(w: number, h: number, color: number, opacity: number) {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });

  const frame = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h));
  group.add(new THREE.LineSegments(frame, material));

  const barY = h / 2 - h * 0.16;
  const bar = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w / 2, barY, 0),
    new THREE.Vector3(w / 2, barY, 0),
  ]);
  group.add(new THREE.Line(bar, material));

  const fill = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      color: SKY_DEEP,
      transparent: true,
      opacity: opacity * 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  group.add(fill);

  return group;
}

export default function FactorHeroScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No WebGL (blocklisted GPU, corporate lockdown, headless) → keep the
    // static gradient backdrop; the page must never break over decoration.
    let renderer: THREE.WebGLRenderer;
    try {
      const probe = document.createElement('canvas');
      if (!probe.getContext('webgl2') && !probe.getContext('webgl')) return;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(SURFACE, 9, 26);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      60,
    );
    camera.position.set(0, 0, 11);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // --- window constellation -------------------------------------------------
    const constellation = new THREE.Group();
    const rng = (min: number, max: number) => min + Math.random() * (max - min);
    const windows: Array<{ group: THREE.Group; speed: number; wobble: number }> = [];
    for (let i = 0; i < 14; i++) {
      const w = rng(1.6, 3.4);
      const win = makeWindow(w, w * rng(0.58, 0.75), i % 3 === 0 ? SKY : SKY_DEEP, rng(0.2, 0.5));
      win.position.set(rng(-9, 9), rng(-4.5, 4.5), rng(-9, 1.5));
      win.rotation.set(rng(-0.25, 0.25), rng(-0.5, 0.5), 0);
      constellation.add(win);
      windows.push({ group: win, speed: rng(0.05, 0.16), wobble: rng(0, Math.PI * 2) });
    }
    scene.add(constellation);

    // --- particles ------------------------------------------------------------
    const COUNT = 220;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = rng(-12, 12);
      positions[i * 3 + 1] = rng(-6, 6);
      positions[i * 3 + 2] = rng(-10, 2);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: SKY,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- the two cursors ------------------------------------------------------
    const skyTexture = makeGlowTexture('#38bdf8');
    const orangeTexture = makeGlowTexture('#ff7600');
    const makeCursor = (texture: THREE.CanvasTexture, scale: number) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      sprite.scale.setScalar(scale);
      scene.add(sprite);
      return sprite;
    };
    const factorCursor = makeCursor(skyTexture, 1.15);
    const humanCursor = makeCursor(orangeTexture, 0.85);

    // --- interaction / lifecycle ---------------------------------------------
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(mount);

    const onResize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const t = clock.getElapsedTime();

      windows.forEach(({ group, speed, wobble }) => {
        group.position.y += Math.sin(t * speed + wobble) * 0.0016;
        group.rotation.y += speed * 0.0012;
      });
      constellation.rotation.y = Math.sin(t * 0.05) * 0.08;
      particles.rotation.y = t * 0.008;

      // Factor leads on a wide lissajous; the human cursor trails its own path,
      // the two crossing every few seconds — co-driving, drawn as light.
      factorCursor.position.set(Math.sin(t * 0.42) * 6.2, Math.sin(t * 0.31 + 1.2) * 2.8, 1.5);
      humanCursor.position.set(Math.sin(t * 0.27 + 2.6) * 5.4, Math.sin(t * 0.5 + 0.4) * 2.2, 1.8);

      camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.03;
      camera.position.y += (pointer.y * 0.6 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, -2);

      renderer.render(scene, camera);
    };

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (visible) render();
    };

    if (reduceMotion) {
      render(); // a single still frame — the composition without the motion
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      observer.disconnect();
      resizeObserver.disconnect();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
      skyTexture.dispose();
      orangeTexture.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
