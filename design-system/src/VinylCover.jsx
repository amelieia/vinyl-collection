import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * VinylCover — a square album-cover component with a light 3D tilt.
 *
 * - A plain square slot: whatever you pass as `children` (an <img>, art,
 *   anything) is clipped to the rounded square automatically. `color` is
 *   just the fallback background behind it.
 * - Tilts toward the cursor on hover, like a card catching the light.
 * - A fixed diagonal sheen (not mouse-tracked) sits on top, like the gloss
 *   on a plastic record sleeve under a studio light — consistent with how
 *   VinylRecord's highlight behaves.
 */
export function VinylCover({
  size = 300,
  radius = 6,
  color = "#d8d8d8",
  children,
  tiltMax = 12,
  sheenOpacity = 0.22,
  sheenAngle = 115,
  sheenWidth = 22,
  sheenFeather = 26,
  springStiffness = 140,
  springDamping = 18,
}) {
  const containerRef = useRef(null);
  const rawRx = useMotionValue(0);
  const rawRy = useMotionValue(0);

  const springOpts = { stiffness: springStiffness, damping: springDamping };
  const rx = useSpring(rawRx, springOpts);
  const ry = useSpring(rawRy, springOpts);

  const shadowBlur = useTransform([rx, ry], ([x, y]) => 24 + (Math.abs(x) + Math.abs(y)) * 1.1);
  const shadowOffsetX = useTransform(ry, (y) => y * 1.2);
  const shadowOffsetY = useTransform(rx, (x) => -x * 1.2 + size * 0.06);
  const dropShadow = useTransform(
    [shadowOffsetX, shadowOffsetY, shadowBlur],
    ([ox, oy, blur]) => `${ox}px ${oy}px ${blur}px rgba(0,0,0,0.3)`
  );

  const half = sheenWidth / 2;
  const feather = sheenFeather;
  const top = Math.max(0, 50 - half - feather);
  const innerTop = Math.max(0, 50 - half);
  const innerBottom = Math.min(100, 50 + half);
  const bottom = Math.min(100, 50 + half + feather);
  const sheenBackground = `linear-gradient(${sheenAngle}deg, ${[
    "transparent 0%",
    `transparent ${top}%`,
    `rgba(255,255,255,${sheenOpacity}) ${innerTop}%`,
    `rgba(255,255,255,${sheenOpacity}) ${innerBottom}%`,
    `transparent ${bottom}%`,
    "transparent 100%",
  ].join(", ")})`;

  function handleMouseMove(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawRy.set((px - 0.5) * 2 * tiltMax);
    rawRx.set(-(py - 0.5) * 2 * tiltMax);
  }

  function handleMouseLeave() {
    rawRx.set(0);
    rawRy.set(0);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX: rx,
          rotateY: ry,
          width: size,
          height: size,
          borderRadius: radius,
          position: "relative",
          transformStyle: "preserve-3d",
          boxShadow: dropShadow,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            background: color,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        >
          {children}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            background: sheenBackground,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </div>
  );
}
