import React, { useRef, useEffect, useState } from 'react';

export interface FrameBorderProps {
  color?: string | [string, string];
  fill?: string;
  radius?: number;
  lineWidth?: number;
  inset?: number;
  glow?: number;
  glowWidth?: number;
  flowSpeed?: number;
  pulseSpeed?: number;
  idlePulses?: number;
  idleSpeed?: number;
  idleStrength?: number;
  intensity?: number;
  opacity?: number;
  grain?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  asGlobalViewport?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const FrameBorder: React.FC<FrameBorderProps> = ({
  color = ['#38bdf8', '#818cf8'],
  fill = 'transparent',
  radius = 16,
  lineWidth = 1.25,
  inset = 0,
  glow = 0.55,
  glowWidth = 90,
  flowSpeed = 1,
  pulseSpeed = 1,
  interactive = true,
  intro = true,
  paused = false,
  asGlobalViewport = false,
  className = '',
  style = {},
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulses, setPulses] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isIntroComplete, setIsIntroComplete] = useState(!intro);

  const color1 = Array.isArray(color) ? color[0] : color;
  const color2 = Array.isArray(color) ? color[1] : color;

  useEffect(() => {
    if (intro) {
      const timer = setTimeout(() => setIsIntroComplete(true), 400);
      return () => clearTimeout(timer);
    }
  }, [intro]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || paused) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPulse = { id: Date.now() + Math.random(), x, y };

    setPulses(prev => [...prev.slice(-4), newPulse]);

    setTimeout(() => {
      setPulses(prev => prev.filter(p => p.id !== newPulse.id));
    }, 1200 / (pulseSpeed || 1));
  };

  if (asGlobalViewport) {
    const pad = inset ?? 6;
    return (
      <div
        className="voyora-global-viewport-frame"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          padding: `${pad}px`,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: `${radius}px`,
            border: `${lineWidth}px solid rgba(56, 189, 248, 0.25)`,
            boxShadow: `inset 0 0 ${glowWidth * glow * 0.35}px rgba(56, 189, 248, ${0.14 * glow}), 0 0 ${glowWidth * 0.2}px rgba(129, 140, 248, ${0.12 * glow})`,
            opacity: isIntroComplete ? 1 : 0,
            transition: 'opacity 0.6s ease',
            boxSizing: 'border-box',
          }}
        >
          {/* Subtle Ambient Light Flow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, transparent 40%, rgba(129, 140, 248, 0.05) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* High-Tech Corner Ticks / Brackets (Pure CSS, 0 SVG calc errors) */}
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: -1,
              width: 22,
              height: 22,
              borderTop: `${lineWidth * 2}px solid #38bdf8`,
              borderLeft: `${lineWidth * 2}px solid #38bdf8`,
              borderTopLeftRadius: `${radius}px`,
              filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.7))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -1,
              right: -1,
              width: 22,
              height: 22,
              borderTop: `${lineWidth * 2}px solid #818cf8`,
              borderRight: `${lineWidth * 2}px solid #818cf8`,
              borderTopRightRadius: `${radius}px`,
              filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.7))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -1,
              left: -1,
              width: 22,
              height: 22,
              borderBottom: `${lineWidth * 2}px solid #38bdf8`,
              borderLeft: `${lineWidth * 2}px solid #38bdf8`,
              borderBottomLeftRadius: `${radius}px`,
              filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.7))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 22,
              height: 22,
              borderBottom: `${lineWidth * 2}px solid #818cf8`,
              borderRight: `${lineWidth * 2}px solid #818cf8`,
              borderBottomRightRadius: `${radius}px`,
              filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.7))',
            }}
          />
        </div>
      </div>
    );
  }

  const effectiveSpeed = (isHovered ? flowSpeed * 2.2 : flowSpeed) * (paused ? 0 : 1);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`frame-border-root ${className}`}
      style={{
        position: 'relative',
        borderRadius: `${radius}px`,
        padding: `${inset}px`,
        backgroundColor: fill,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Animated Glowing Outer/Inner Perimeter */}
      <div
        className="frame-border-glow-layer"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: `${radius}px`,
          boxShadow: `inset 0 0 ${glowWidth * glow * 0.35}px ${color1}25, 0 0 ${glowWidth * 0.2}px ${color2}20`,
          border: `${lineWidth}px solid ${color1}35`,
          opacity: isIntroComplete ? 1 : 0,
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Orbiting Light Beam */}
      {!paused && (
        <div
          className="frame-border-orbit"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: `${radius}px`,
            padding: `${lineWidth}px`,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            className="frame-border-beam"
            style={{
              position: 'absolute',
              inset: '-150%',
              animation: `frameBorderRotate ${12 / (effectiveSpeed || 1)}s linear infinite`,
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${color1} 90deg, transparent 180deg, ${color2} 270deg, transparent 360deg)`,
            }}
          />
        </div>
      )}

      {/* Click-triggered Pulse Ripples */}
      {pulses.map(pulse => (
        <span
          key={pulse.id}
          className="frame-border-pulse-wave"
          style={{
            position: 'absolute',
            left: `${pulse.x}px`,
            top: `${pulse.y}px`,
            borderColor: color1,
            boxShadow: `0 0 24px ${color2}`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Corner Bracket Accents (Pure CSS) */}
      <div
        className="frame-border-corner top-left"
        style={{
          position: 'absolute',
          top: -1,
          left: -1,
          width: 14,
          height: 14,
          borderColor: color1,
          borderTopLeftRadius: `${radius}px`,
          pointerEvents: 'none',
        }}
      />
      <div
        className="frame-border-corner top-right"
        style={{
          position: 'absolute',
          top: -1,
          right: -1,
          width: 14,
          height: 14,
          borderColor: color2,
          borderTopRightRadius: `${radius}px`,
          pointerEvents: 'none',
        }}
      />
      <div
        className="frame-border-corner bottom-left"
        style={{
          position: 'absolute',
          bottom: -1,
          left: -1,
          width: 14,
          height: 14,
          borderColor: color1,
          borderBottomLeftRadius: `${radius}px`,
          pointerEvents: 'none',
        }}
      />
      <div
        className="frame-border-corner bottom-right"
        style={{
          position: 'absolute',
          bottom: -1,
          right: -1,
          width: 14,
          height: 14,
          borderColor: color2,
          borderBottomRightRadius: `${radius}px`,
          pointerEvents: 'none',
        }}
      />

      {/* Inner Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>

      <style>{`
        .frame-border-root {
          position: relative;
          box-sizing: border-box;
        }
        .frame-border-orbit {
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }
        @keyframes frameBorderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .frame-border-pulse-wave {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          border: 2px solid;
          transform: translate(-50%, -50%);
          animation: frameBorderPulse 0.9s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        @keyframes frameBorderPulse {
          0% {
            width: 8px;
            height: 8px;
            opacity: 1;
          }
          100% {
            width: 320px;
            height: 320px;
            opacity: 0;
          }
        }
        .frame-border-corner {
          width: 14px;
          height: 14px;
          border-width: 2px;
          border-style: solid;
          opacity: 0.85;
          transition: all 0.25s ease;
        }
        .frame-border-root:hover .frame-border-corner {
          opacity: 1;
          filter: drop-shadow(0 0 6px currentColor);
        }
        .frame-border-corner.top-left {
          border-right: none;
          border-bottom: none;
        }
        .frame-border-corner.top-right {
          border-left: none;
          border-bottom: none;
        }
        .frame-border-corner.bottom-left {
          border-right: none;
          border-top: none;
        }
        .frame-border-corner.bottom-right {
          border-left: none;
          border-top: none;
        }
      `}</style>
    </div>
  );
};

export default FrameBorder;
