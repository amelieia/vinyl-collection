import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Baked from values tuned live via the DialKit panel (roughness, clearcoat,
// groove bump, lighting, and the highlight wedge shape/sweep). The public
// component only exposes size/label/discColor — everything else here is the
// settled "look" rather than something meant to keep changing per instance.
const ROUGHNESS = 0.45;
const CLEARCOAT = 0.1;
const CLEARCOAT_ROUGHNESS = 0.18;
const BUMP_SCALE = 0.012;
const LIGHT_INTENSITY = 0.6;
const SWEEP_SPEED = 1.2;
const WEDGE_ANGLE = 139;
const WEDGE_WIDTH = 24;
const WEDGE_FEATHER = 26;
const WEDGE_OPACITY = 0.15;
const ENV_PRESET = "apartment";
const LABEL_FALLBACK_COLOR = "#2a2a2a";

function useGrooveMaps(size = 1024, color) {
  return useMemo(() => {
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = bumpCanvas.height = size;
    const bctx = bumpCanvas.getContext("2d");

    const roughCanvas = document.createElement("canvas");
    roughCanvas.width = roughCanvas.height = size;
    const rctx = roughCanvas.getContext("2d");

    // Baked directly into the albedo — unlike the bump/roughness maps,
    // this stays visible regardless of light angle, which is what actually
    // guarantees the banding reads the way it does in reference photos.
    //
    // This texture carries the FINAL color, not a grey mask meant to be
    // multiplied by material.color — three.js multiplies `map` by
    // `material.color` per-pixel, so a white highlight painted on a mask
    // gets crushed straight back to near-black against a dark vinyl color.
    // The cap material's own `color` is set to white so this texture passes
    // through unmultiplied.
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = colorCanvas.height = size;
    const cctx = colorCanvas.getContext("2d");

    const base = new THREE.Color(color);
    const [baseR, baseG, baseB] = [base.r * 255, base.g * 255, base.b * 255];
    const clamp255 = (v) => Math.min(255, Math.max(0, v));

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.49;
    const innerR = size * 0.2; // label sits on top of this area, so it doesn't matter here

    bctx.fillStyle = "rgb(128,128,128)";
    bctx.fillRect(0, 0, size, size);
    rctx.fillStyle = "rgb(90,90,90)";
    rctx.fillRect(0, 0, size, size);
    cctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
    cctx.fillRect(0, 0, size, size);

    // Fewer, bolder rings than a real record's groove pitch — with
    // mipmapping (needed to avoid shimmer as the disc turns), a texture
    // this size can't preserve hundreds of single-pixel rings; they'd
    // just average out to flat grey at render resolution. ~70 wide bands
    // survive minification and still read as "grooves" at a glance.
    const ringCount = 70;
    const bandWidth = ((outerR - innerR) / ringCount) * 1.05;
    for (let i = 0; i < ringCount; i++) {
      const t = i / ringCount;
      const r = innerR + t * (outerR - innerR);
      const jitter = 0.6 + Math.random() * 0.4;
      const bumpShade = 128 + (i % 2 === 0 ? 1 : -1) * 55 * jitter;
      const roughShade = 90 + (i % 2 === 0 ? 1 : -1) * 65 * jitter;
      // Lighten/darken the base color per ring, rather than an
      // independent grey — keeps the grooves tinted with the vinyl color.
      const delta = (i % 2 === 0 ? 1 : -1) * 30 * jitter;
      const cr = clamp255(baseR + delta);
      const cg = clamp255(baseG + delta);
      const cb = clamp255(baseB + delta);

      bctx.strokeStyle = `rgb(${bumpShade},${bumpShade},${bumpShade})`;
      bctx.lineWidth = bandWidth;
      bctx.beginPath();
      bctx.arc(cx, cy, r, 0, Math.PI * 2);
      bctx.stroke();

      rctx.strokeStyle = `rgb(${roughShade},${roughShade},${roughShade})`;
      rctx.lineWidth = bandWidth;
      rctx.beginPath();
      rctx.arc(cx, cy, r, 0, Math.PI * 2);
      rctx.stroke();

      cctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
      cctx.lineWidth = bandWidth;
      cctx.beginPath();
      cctx.arc(cx, cy, r, 0, Math.PI * 2);
      cctx.stroke();
    }

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.colorSpace = THREE.NoColorSpace;
    bumpMap.needsUpdate = true;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.colorSpace = THREE.NoColorSpace;
    roughnessMap.needsUpdate = true;

    const colorMap = new THREE.CanvasTexture(colorCanvas);
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.needsUpdate = true;

    return { bumpMap, roughnessMap, colorMap };
  }, [size, color]);
}

// Two opposing wedges meeting at the center, widening toward the rim. A
// conic gradient alone can't produce that taper — it varies by angle only,
// so the same brightness applies at every radius, which is a uniform-width
// RING, not a wedge that narrows to a point. The wedge shape only works
// because the gradient runs across the *entire* disc down to a genuine
// point at the center, with the opaque label sitting on top to cover that
// tip — not because anything is cut out of the gradient itself. The
// overlay mesh is positioned just *below* the label (see HighlightOverlay)
// so the label naturally occludes the center via normal depth testing.
function useHighlightTexture({ width, feather, opacity, size = 1024 }) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.5;

    const half = width / 2 / 360;
    // half + feat must stay under 0.25 (90°) or the two wedges' fade-outs
    // start to overlap/invert the gradient's stop order; anywhere close to
    // that limit leaves only a razor-thin "clear" gap between them, which
    // doesn't survive texture minification and renders as an inconsistent,
    // view-dependent dark seam rather than a clean gap. Keep a real margin.
    const feat = Math.min(feather / 360, 0.25 - half - 0.035);
    const bright = `rgba(255,255,255,${opacity})`;
    const clear = "rgba(255,255,255,0)";
    const gradient = ctx.createConicGradient(0, cx, cy);
    gradient.addColorStop(0, bright);
    gradient.addColorStop(half, bright);
    gradient.addColorStop(half + feat, clear);
    gradient.addColorStop(0.5 - half - feat, clear);
    gradient.addColorStop(0.5 - half, bright);
    gradient.addColorStop(0.5 + half, bright);
    gradient.addColorStop(0.5 + half + feat, clear);
    gradient.addColorStop(1 - half - feat, clear);
    gradient.addColorStop(1 - half, bright);
    gradient.addColorStop(1, bright);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    // A soft gradient like this doesn't need mipmaps, and disabling them
    // avoids the same minification softening/averaging that made the
    // groove rings vanish earlier — keeps the gap between wedges crisp at
    // any zoom level instead of blurring unpredictably.
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [width, feather, opacity, size]);
}

function HighlightOverlay() {
  const map = useHighlightTexture({ width: WEDGE_WIDTH, feather: WEDGE_FEATHER, opacity: WEDGE_OPACITY });
  const meshRef = useRef();

  // The outer group holds the one-time tilt that lays the circle flat; the
  // inner mesh only ever rotates on its own Z axis (its own normal once
  // tilted), so the per-frame spin can't fight with that fixed tilt the way
  // it would if both lived on the same object's Euler angles.
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * ((SWEEP_SPEED * Math.PI) / 180) * 12;
    }
  });

  return (
    // y=0.0103 — below the label (0.0105) so the label's own depth occludes
    // this overlay's center point, same layering trick as the CSS version.
    <group position={[0, 0.0103, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={meshRef} rotation={[0, 0, (WEDGE_ANGLE * Math.PI) / 180]}>
        <circleGeometry args={[1, 96]} />
        <meshBasicMaterial
          map={map}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function PlainLabel({ radius }) {
  return (
    <mesh position={[0, 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial color={LABEL_FALLBACK_COLOR} roughness={0.5} metalness={0} />
    </mesh>
  );
}

function LabelImage({ image, radius }) {
  const tex = useTexture(image);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshStandardMaterial map={tex} roughness={0.5} metalness={0} />
    </mesh>
  );
}

function SpindleHole() {
  // Sits above the label (0.0105) so it reads as a small punched-through
  // hole regardless of what's on the label — an image or the plain fallback.
  return (
    <mesh position={[0, 0.0107, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.022, 32]} />
      <meshStandardMaterial color="#0b0b0b" roughness={0.6} metalness={0} />
    </mesh>
  );
}

function Disc({ color, label }) {
  const { bumpMap, roughnessMap, colorMap } = useGrooveMaps(1024, color);

  const sideMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.55,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        envMapIntensity: 0.4,
      }),
    [color]
  );
  const capMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        // White — the final color (base + groove shading) is already baked
        // into colorMap, so this must stay unmultiplied. (The highlight
        // wedges are a separate rotating overlay now, not baked in here.)
        color: "#ffffff",
        map: colorMap,
        roughness: ROUGHNESS,
        roughnessMap,
        bumpMap,
        bumpScale: BUMP_SCALE,
        clearcoat: CLEARCOAT,
        clearcoatRoughness: CLEARCOAT_ROUGHNESS,
        envMapIntensity: 0.4,
      }),
    [colorMap, roughnessMap, bumpMap]
  );

  return (
    <group>
      <mesh castShadow receiveShadow material={[sideMat, capMat, capMat]}>
        <cylinderGeometry args={[1, 1, 0.02, 160, 1]} />
      </mesh>

      {label ? <LabelImage image={label} radius={0.36} /> : <PlainLabel radius={0.36} />}
      <SpindleHole />

      <HighlightOverlay />
    </group>
  );
}

/**
 * VinylRecord3D — a real WebGL vinyl record (cylinder geometry + PBR
 * materials + environment lighting) instead of the CSS/2D VinylRecord. The
 * grooves are a real bump/roughness map, so specular highlights and the
 * edge's light response are physically computed, not hand-painted.
 *
 * Material finish, groove detail, lighting, and the highlight wedge sweep
 * were all tuned live via DialKit and are now fixed internals — the only
 * things left to vary per instance are size, the center label image, and
 * the vinyl's own color.
 *
 * `interactive` (default true) controls whether the user can drag to orbit
 * the camera. Set it false when embedding this somewhere passive like a
 * list card — unlike VinylCover's hover-tilt, which always resets itself,
 * an orbit drag leaves the camera wherever it was released, which is fine
 * for a standalone viewer but wrong for a small static thumbnail.
 */
export function VinylRecord3D({ size = 420, discColor = "#0a0a0a", label, interactive = true }) {
  return (
    <div style={{ width: size, height: size }}>
      {/* Flat, top-down — as if the screen were a table. A near-vertical
          camera with a narrow fov clips the disc's own cap: at fov 32 and
          the old ~2.5-unit distance, the vertical frustum's half-height at
          that distance (~0.73) was smaller than the disc's own radius (1),
          so the far edge of the cap got cut off by the view edge — visible
          as a flat-topped "dome" that only disappeared once enough camera
          tilt foreshortened the disc short enough to fit. Rather than tilt
          around that, fov/distance here are sized to fit the full radius-1
          disc with margin even dead-on from directly above.
          gl={{ alpha: true }} keeps the canvas itself transparent. */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ position: [0, 3.13, 0.27], fov: 45 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[2.5, 4, 2]}
            intensity={LIGHT_INTENSITY}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-2, 1.2, -2]} intensity={0.3} />
          {/* Low, grazing light — this is what makes the grooves actually
              visible as banding, the way a record photographs under a
              raking studio light rather than straight overhead. */}
          <directionalLight position={[2.2, 0.35, 1.4]} intensity={LIGHT_INTENSITY * 0.9} />

          <Disc color={discColor} label={label} />

          {/* interactive=false also skips the ground-shadow plane — a
              small embedded card doesn't need it, and it's one less thing
              rendering at a size where its own soft edge could show. */}
          {interactive && (
            <ContactShadows position={[0, -0.02, 0]} opacity={0.45} scale={4} blur={2.2} far={1.2} />
          )}
          <Environment preset={ENV_PRESET} background={false} />
        </Suspense>

        {/* The record and camera both stay put — no autoRotate. It's the
            highlight overlay that moves, like a light sweeping around a
            stationary disc rather than the disc spinning. Still full
            freedom to orbit manually — no polar-angle clamp, so it can be
            dragged all the way around, edge-on, or underneath — unless
            `interactive` is false, in which case this is omitted entirely
            and the camera just sits at its default angle. */}
        {interactive && (
          <OrbitControls enablePan={false} minDistance={1.4} maxDistance={5} rotateSpeed={1} />
        )}
      </Canvas>
    </div>
  );
}
