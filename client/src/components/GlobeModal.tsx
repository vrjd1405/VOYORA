import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Plane, RotateCcw, Compass } from 'lucide-react';

interface GlobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTravelNext: () => void;
}

export const GlobeModal: React.FC<GlobeModalProps> = ({ isOpen, onClose, onTravelNext }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [traveling, setTraveling] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    const TURNS = 1.5;
    const DURATION = 3.6;
    const R = 1.28;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const sun = new THREE.DirectionalLight(0xfff3e0, 1.8);
    sun.position.set(5, 2, 4);
    scene.add(sun);

    // Stars background
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 40;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      starPos.set([r * Math.sin(b) * Math.cos(a), r * Math.cos(b), r * Math.sin(b) * Math.sin(a)], i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 0.35,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.85,
        })
      )
    );

    // Procedural noise for seamless 3D Earth
    function hash(x: number, y: number, z: number) {
      const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
      return s - Math.floor(s);
    }
    function vnoise(x: number, y: number, z: number) {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const xf = x - xi, yf = y - yi, zf = z - zi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
      const L = (a: number, b: number, t: number) => a + (b - a) * t;
      return L(
        L(
          L(hash(xi, yi, zi), hash(xi + 1, yi, zi), u),
          L(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u),
          v
        ),
        L(
          L(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u),
          L(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u),
          v
        ),
        w
      );
    }
    const fbm = (x: number, y: number, z: number, o = 5) => {
      let s = 0, a = 0.5;
      for (let i = 0; i < o; i++) {
        s += a * vnoise(x, y, z);
        x *= 2; y *= 2; z *= 2; a /= 2;
      }
      return s;
    };

    function proceduralMap(kind: 'earth' | 'clouds') {
      const W = 768, H = 384;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d')!;
      const img = ctx.createImageData(W, H);

      for (let j = 0; j < H; j++) {
        for (let i = 0; i < W; i++) {
          const lon = (i / W) * 6.2832;
          const lat = (0.5 - j / H) * Math.PI;
          const x = Math.cos(lat) * Math.cos(lon);
          const y = Math.sin(lat);
          const z = Math.cos(lat) * Math.sin(lon);
          const k = (j * W + i) * 4;

          let r = 0, g = 0, b = 0, a = 255;
          if (kind === 'earth') {
            const n = fbm(x * 1.7 + 5, y * 1.7, z * 1.7);
            const ice = Math.abs(y) > 0.86 + (fbm(x * 6, y * 6, z * 6, 3) - 0.5) * 0.1;
            if (ice) {
              [r, g, b] = [235, 240, 248];
            } else if (n > 0.52) {
              const t = Math.min((n - 0.52) / 0.2, 1);
              const dry = Math.abs(y) < 0.45 ? fbm(x * 4 + 9, y * 4, z * 4, 3) : 0.2;
              r = 40 + 110 * t * (0.4 + dry);
              g = 100 + 40 * (1 - t) - 30 * dry * t;
              b = 50 + 20 * t;
            } else {
              const d = Math.min((0.52 - n) / 0.3, 1);
              r = 16 - 10 * d;
              g = 80 - 45 * d;
              b = 165 - 65 * d;
            }
          } else {
            const n = fbm(x * 2.6 + 20, y * 2.6, z * 2.6, 6);
            const t = Math.max((n - 0.5) * 3.2, 0);
            r = g = b = 255;
            a = Math.min(t, 1) * 255;
          }
          img.data.set([r, g, b, a], k);
        }
      }
      ctx.putImageData(img, 0, 0);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    // Earth Sphere
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshPhongMaterial({
        map: proceduralMap('earth'),
        shininess: 16,
        specular: new THREE.Color(0x334155),
      })
    );
    scene.add(earth);

    // Clouds
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 96, 96),
      new THREE.MeshPhongMaterial({
        map: proceduralMap('clouds'),
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      })
    );
    scene.add(clouds);

    // Atmosphere Glow
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.14, 96, 96),
        new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vN;
            void main() {
              vN = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vN;
            void main() {
              float i = pow(0.68 - dot(vN, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * i * 1.6;
            }
          `,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        })
      )
    );

    // Airliner
    function buildPlane() {
      const g = new THREE.Group();
      const white = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.35 });
      const blue = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.4, roughness: 0.4 });
      const grey = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });

      const prof = [
        [0, 0.3], [0.028, 0.27], [0.048, 0.21], [0.055, 0.1],
        [0.055, -0.15], [0.046, -0.26], [0.018, -0.33], [0, -0.35]
      ].map(p => new THREE.Vector2(p[0], p[1]));

      const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), white);
      body.rotation.z = Math.PI / 2;
      g.add(body);

      const cockpit = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0x0a1024, metalness: 0.9, roughness: 0.1 })
      );
      cockpit.position.set(-0.2, 0.025, 0);
      cockpit.scale.set(1.6, 0.7, 1);
      g.add(cockpit);

      const wingShape = (a: number, b: number, c: number, d: number, y: number) => {
        const s = new THREE.Shape();
        s.moveTo(a, 0.05);
        s.lineTo(b, y);
        s.lineTo(c, y);
        s.lineTo(d, 0.05);
        s.closePath();
        return s;
      };

      const wing = (shape: THREE.Shape, depth: number, mat: THREE.Material, pos: [number, number], sc: number) => {
        for (const side of [1, -1]) {
          const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }), mat);
          m.material.side = THREE.DoubleSide;
          m.rotation.x = -Math.PI / 2;
          m.position.set(pos[0], pos[1], 0);
          m.scale.set(sc, side * sc, 1);
          g.add(m);
        }
      };

      wing(wingShape(-0.03, 0.14, 0.19, 0.1, 0.45), 0.012, white, [0, -0.02], 1);
      wing(wingShape(-0.03, 0.14, 0.19, 0.1, 0.45), 0.01, white, [0.27, 0.0], 0.38);

      for (const z of [0.17, -0.17]) {
        const e = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.026, 0.12, 16), grey);
        e.rotation.z = Math.PI / 2;
        e.position.set(-0.04, -0.06, z);
        g.add(e);
      }

      const fs = new THREE.Shape();
      fs.moveTo(0.17, 0.04);
      fs.lineTo(0.3, 0.2);
      fs.lineTo(0.35, 0.2);
      fs.lineTo(0.31, 0.04);
      fs.closePath();
      const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.012, bevelEnabled: false }), blue);
      fin.position.z = -0.006;
      g.add(fin);

      g.scale.setScalar(0.9);
      return g;
    }

    const tilt = new THREE.Group();
    tilt.rotation.set(0.55, 0, 0.1);
    scene.add(tilt);

    const pivot = new THREE.Group();
    pivot.visible = false;
    tilt.add(pivot);

    // Contrail
    for (let k = 0; k < 28; k++) {
      const arm = new THREE.Group();
      arm.rotation.z = -(k + 1) * 0.045;
      const d = new THREE.Mesh(
        new THREE.SphereGeometry(0.012 * (1 - k / 30), 8, 8),
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.7 * (1 - k / 28),
          depthWrite: false,
        })
      );
      d.position.y = R;
      arm.add(d);
      pivot.add(arm);
    }

    const plane = buildPlane();
    plane.position.y = R;
    pivot.add(plane);

    let isTraveling = false;
    let t0 = 0;
    const clock = new THREE.Clock();
    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const now = clock.elapsedTime;

      earth.rotation.y += dt * (isTraveling ? 0.5 : 0.06);
      clouds.rotation.y += dt * (isTraveling ? 0.6 : 0.08);

      if (!isTraveling) {
        camera.position.z += (4.2 - camera.position.z) * 0.05;
      } else {
        const p = Math.min((now - t0) / DURATION, 1);
        pivot.rotation.z = ease(p) * Math.PI * 2 * TURNS;
        plane.scale.setScalar(0.9 * Math.max(Math.min(p / 0.12, 1), 0.001));
        plane.rotation.x = Math.sin(p * Math.PI) * 0.35;
        camera.position.z += (2.7 - camera.position.z) * 0.035;
        camera.position.x = Math.sin(p * Math.PI) * 0.25;

        if (p >= 1) {
          setFinished(true);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const triggerTravel = () => {
      pivot.visible = true;
      isTraveling = true;
      t0 = clock.elapsedTime;
      setTraveling(true);
      setFinished(false);
    };

    (container as any).__triggerTravel = triggerTravel;
    (container as any).__resetTravel = () => {
      isTraveling = false;
      pivot.visible = false;
      camera.position.x = 0;
      camera.position.z = 4.2;
      setTraveling(false);
      setFinished(false);
    };

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartTravel = () => {
    if (mountRef.current && (mountRef.current as any).__triggerTravel) {
      (mountRef.current as any).__triggerTravel();
    }
  };

  const handleReplay = () => {
    if (mountRef.current && (mountRef.current as any).__resetTravel) {
      (mountRef.current as any).__resetTravel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050811]/95 backdrop-blur-md">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition shadow-lg"
        title="Exit 3D Globe"
      >
        <X size={20} />
      </button>

      {/* Floating Hero Content (visible when not traveling) */}
      {!traveling && (
        <div className="absolute top-[12vh] inset-x-0 text-center px-4 pointer-events-none z-10 transition-opacity duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass size={13} />
            <span>Voyora Interactive 3D Orbit</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Where to <span className="text-sky-400">next?</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Discover verified architectural relics, sacred shrines, and coastal shores across Tamil Nadu, India, and the world.
          </p>
        </div>
      )}

      {/* Action Button: Travel */}
      {!traveling && (
        <button
          onClick={handleStartTravel}
          className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 z-20 px-8 py-3.5 rounded-full bg-sky-400 text-slate-950 font-bold text-base hover:bg-sky-300 hover:scale-105 transition transform shadow-[0_0_35px_rgba(56,189,248,0.55)] flex items-center gap-2.5"
        >
          <span>Travel</span>
          <Plane size={18} className="rotate-45" />
        </button>
      )}

      {/* Landed Card: Appears after flight animation */}
      {finished && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 z-30 text-center px-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-sky-400 mb-4 inline-block">
            <Plane size={36} />
          </div>
          <h3 className="text-3xl sm:text-5xl font-black text-white">
            Welcome to <span className="text-sky-400">VOYORA</span>
          </h3>
          <p className="text-slate-300 max-w-md mt-2 text-sm sm:text-base">
            Your flight has landed! Ready to explore authentic sights across Chennai, Madurai, Ooty, Mahabalipuram, and worldwide?
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                onClose();
                onTravelNext();
              }}
              className="px-6 py-2.5 rounded-full bg-sky-400 text-slate-950 font-bold text-sm hover:bg-sky-300 transition shadow-lg shadow-sky-500/25"
            >
              Explore Destinations →
            </button>
            <button
              onClick={handleReplay}
              className="px-5 py-2.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 transition text-sm flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Replay Orbit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
