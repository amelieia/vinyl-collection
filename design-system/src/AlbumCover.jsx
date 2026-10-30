import { useEffect, useRef, useState } from "react";
import { colors } from "./colors";
import { VinylRecord3D } from "./VinylRecord3D";
import { VinylCover } from "./VinylCover";

// One-off framing effect for `framed` mode (dark offset + light edge) —
// not a shadow token, specific to this inset-photo treatment, pulled
// straight from the Figma detail-screen reference (node 606:3726).
const FRAMED_PHOTO_SHADOW =
  "0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px -1px rgba(0, 0, 0, 0.48), 0px 0px 0px 1px rgba(0, 0, 0, 0.18)";

/**
 * AlbumCover — the single square "what does this album look like" slot,
 * shared between AlbumCard (small list thumbnail) and AlbumDetailSheet
 * (large detail view). Three states: the real spinning VinylRecord3D for
 * a purchased album, a plain cover image, or a flat placeholder.
 *
 * Wrapped in VinylCover for its mouse-tilt + sheen — a hover interaction,
 * so it's inert on an actual phone's touch screen, but still worth having
 * for anyone browsing from a desktop browser (or this app's own
 * /preview harness, which runs in a real desktop browser context).
 *
 * `framed` switches to the detail-sheet treatment: the photo sits inset
 * with its own drop shadow inside a slightly larger surface-colored
 * square, instead of filling the slot edge to edge.
 *
 * `interactive` only matters when `isPurchased` — it's the one knob that
 * decides whether dragging the vinyl orbits the 3D camera (separate from
 * VinylCover's tilt, which is just a hover effect on the whole square).
 * Default false: a small list thumbnail shouldn't let a drag grab the
 * camera and leave it stuck in some random orbit. The detail sheet opts
 * in explicitly.
 *
 * Measures its own box (ResizeObserver) — both VinylCover and the
 * VinylRecord3D canvas need a real pixel size, not a percentage.
 */
export function AlbumCover({
  coverImage,
  isPurchased = false,
  discColor = "#0a0a0a",
  radius = 0,
  framed = false,
  framePadding = 17,
  interactive = false,
}) {
  const measureRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (!measureRef.current) return undefined;
    const el = measureRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.round(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const backgroundColor = isPurchased ? "#EBEBEB" : framed ? colors.background.surfaceAlt : "#DDDDDD";

  return (
    <div ref={measureRef} style={{ width: "100%", aspectRatio: "1" }}>
      {size > 0 && (
        <VinylCover size={size} radius={radius} color={backgroundColor}>
          {isPurchased ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Slightly over the measured box (clipped by VinylCover's
                  own overflow:hidden) — fills edge to edge instead of
                  leaving a hairline sliver of background from rounding. */}
              <VinylRecord3D
                size={Math.round(size * 1.01)}
                discColor={discColor}
                label={coverImage}
                interactive={interactive}
              />
            </div>
          ) : coverImage && framed ? (
            <img
              src={coverImage}
              alt=""
              style={{
                position: "absolute",
                inset: framePadding,
                width: `calc(100% - ${framePadding * 2}px)`,
                height: `calc(100% - ${framePadding * 2}px)`,
                objectFit: "cover",
                boxShadow: FRAMED_PHOTO_SHADOW,
              }}
            />
          ) : coverImage ? (
            <img src={coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : null}
        </VinylCover>
      )}
    </div>
  );
}
