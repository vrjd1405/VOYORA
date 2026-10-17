import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Plane, ChevronDown, Compass, Sparkles } from 'lucide-react';

interface GlobeIntroSlideProps {
  onTravelClick: () => void;
}

export const GlobeIntroSlide: React.FC<GlobeIntroSlideProps> = ({ onTravelClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isTraveling, setIsTraveling] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 4.1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Ambient light & Sunlight
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(4, 2.5, 4);
    scene.add(sunLight);

    // Secondary fill light for soft shadows
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    // Stars background
    const starCount = 1800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 40 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.3,
        transparent: true,
        opacity: 0.75,
      })
    );
    scene.add(stars);

    // Earth Sphere Texture Loader
    const textureLoader = new THREE.TextureLoader();
    
    // Procedural Fallback Texture generator if image fails to load
    const createFallbackCanvas = (type: 'earth' | 'clouds') => {
      const w = 512, h = 256;
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d')!;
      if (type === 'earth') {
        ctx.fillStyle = '#0f386b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.arc(200, 120, 60, 0, Math.PI * 2);
        ctx.arc(320, 140, 70, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, w, h);
      }
      return new THREE.CanvasTexture(c);
    };

    let earthMap = createFallbackCanvas('earth');
    let cloudsMap = createFallbackCanvas('clouds');

    // Load local high-res NASA Blue Marble textures
    textureLoader.load(
      '/textures/earth.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        earthMaterial.map = tex;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      (err) => console.warn('Using procedural earth fallback', err)
    );

    textureLoader.load(
      '/textures/clouds.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        cloudsMaterial.map = tex;
        cloudsMaterial.needsUpdate = true;
      },
      undefined,
      (err) => console.warn('Using procedural clouds fallback', err)
    );

    // Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(1.22, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      shininess: 25,
      specular: new THREE.Color(0x38bdf8),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Clouds Sphere
    const cloudsGeometry = new THREE.SphereGeometry(1.238, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Vibrant Atmospheric Blue Glow Halo (Exact match to screenshot!)
    const atmosphereGeometry = new THREE.SphereGeometry(1.42, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.0, 0.68, 1.0, 1.0) * intensity * 2.4;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Inner Rim Fresnel Glow for photorealistic edge light
    const innerRimMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
          gl_FragColor = vec4(0.22, 0.74, 0.97, 0.28) * pow(intensity, 3.2);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const innerRim = new THREE.Mesh(new THREE.SphereGeometry(1.228, 64, 64), innerRimMaterial);
    scene.add(innerRim);

    // Orbiting Airliner Group
    const orbitTilt = new THREE.Group();
    orbitTilt.rotation.set(0.48, 0.2, 0.15);
    scene.add(orbitTilt);

    const orbitPivot = new THREE.Group();
    orbitTilt.add(orbitPivot);

    const R = 1.52; // flight radius

    // Contrail particles
    for (let k = 0; k < 30; k++) {
      const arm = new THREE.Group();
      arm.rotation.z = -(k + 1) * 0.04;
      const contrail = new THREE.Mesh(
        new THREE.SphereGeometry(0.014 * (1 - k / 32), 8, 8),
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.75 * (1 - k / 30),
          depthWrite: false,
        })
      );
      contrail.position.y = R;
      arm.add(contrail);
      orbitPivot.add(arm);
    }

    // Low-poly Airliner Model
    const planeGroup = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4, roughness: 0.3 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.3, roughness: 0.4 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });

    // Fuselage
    const fuselage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.024, 0.54, 16),
      whiteMat
    );
    fuselage.rotation.z = Math.PI / 2;
    planeGroup.add(fuselage);

    // Nose
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.037, 16, 16),
      whiteMat
    );
    nose.position.x = -0.27;
    nose.scale.set(1.4, 1, 1);
    planeGroup.add(nose);

    // Cockpit Window
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 12, 8),
      darkMat
    );
    cockpit.position.set(-0.24, 0.024, 0);
    cockpit.scale.set(1.4, 0.8, 1);
    planeGroup.add(cockpit);

    // Main Wings
    const wingGeo = new THREE.BoxGeometry(0.12, 0.008, 0.62);
    const wings = new THREE.Mesh(wingGeo, whiteMat);
    wings.position.set(-0.04, -0.008, 0);
    planeGroup.add(wings);

    // Tail Fin
    const finGeo = new THREE.BoxGeometry(0.09, 0.13, 0.01);
    const fin = new THREE.Mesh(finGeo, blueMat);
    fin.position.set(0.22, 0.07, 0);
    fin.rotation.z = -0.35;
    planeGroup.add(fin);

    planeGroup.scale.setScalar(0.75);
    planeGroup.position.y = R;
    orbitPivot.add(planeGroup);

    // Interactive Drag to Rotate Globe
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotSpeedX = 0;
    let rotSpeedY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      earth.rotation.y += deltaX * 0.005;
      earth.rotation.x += deltaY * 0.005;
      clouds.rotation.y += deltaX * 0.005;
      clouds.rotation.x += deltaY * 0.005;

      rotSpeedX = deltaX * 0.005;
      rotSpeedY = deltaY * 0.005;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      if (!isDragging) {
        earth.rotation.y += 0.0025 + rotSpeedX * 0.05;
        earth.rotation.x += rotSpeedY * 0.05;
        clouds.rotation.y += 0.0035 + rotSpeedX * 0.05;
        clouds.rotation.x += rotSpeedY * 0.05;
        rotSpeedX *= 0.94;
        rotSpeedY *= 0.94;
      }

      // Airliner continuous flight orbit
      orbitPivot.rotation.z += delta * 0.55;
      planeGroup.rotation.x = Math.sin(clock.elapsedTime * 2) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleTravelClick = () => {
    setIsTraveling(true);
    setTimeout(() => {
      setIsTraveling(false);
      onTravelClick();
    }, 700);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#030712] select-none py-10 px-4">
      {/* 3D Canvas Background Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        title="Click and drag to spin the 3D globe"
      />

      {/* Top Header: Exact match to user image */}
      <div className="relative z-10 text-center max-w-2xl mx-auto pt-6 sm:pt-10 pointer-events-none animate-fade-in">
        {/* Voyora Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <Compass size={14} className="text-sky-400 animate-spin-slow" />
          <span>VOYORA • SMART TRAVEL ARCHITECT</span>
        </div>

        {/* Title: Where to next? */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none">
          Where to <span className="text-[#38bdf8] drop-shadow-[0_0_35px_rgba(56,189,248,0.85)]">next?</span>
        </h1>

        {/* Subtitle: Discover places. Plan your trip. Save it. */}
        <p className="mt-3 text-slate-300 text-base sm:text-xl font-medium tracking-wide drop-shadow-md">
          Discover places. Plan your trip. Save it.
        </p>
      </div>

      {/* Middle Spacer to let the 3D Globe shine in the center */}
      <div className="flex-1 w-full pointer-events-none min-h-[300px] sm:min-h-[420px]" />

      {/* Bottom Button & Scroll Indicator: Exact match to user image */}
      <div className="relative z-10 flex flex-col items-center gap-4 pb-4 animate-slide-up">
        {/* The Cyan Travel ✈ Button */}
        <button
          onClick={handleTravelClick}
          className={`group relative px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-[#00aaff] text-[#050811] font-black text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,170,255,0.7)] hover:shadow-[0_0_60px_rgba(0,170,255,0.9)] flex items-center gap-3 cursor-pointer ${
            isTraveling ? 'scale-110 bg-sky-300 ring-4 ring-sky-400/50' : ''
          }`}
          title="Begin your journey into VOYORA"
        >
          <span>Travel</span>
          <Plane 
            size={22} 
            className={`rotate-45 text-[#050811] transition-transform duration-500 ${
              isTraveling ? 'translate-x-3 -translate-y-3' : 'group-hover:translate-x-1 group-hover:-translate-y-1'
            }`} 
          />
        </button>

        {/* Gentle Scroll Hint */}
        <button
          onClick={onTravelClick}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-300 transition tracking-wider uppercase mt-1 cursor-pointer"
        >
          <span>Scroll down to Destination Chooser</span>
          <ChevronDown size={14} className="animate-bounce" />
        </button>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 16s linear infinite;
        }
      `}</style>
    </section>
  );
};
