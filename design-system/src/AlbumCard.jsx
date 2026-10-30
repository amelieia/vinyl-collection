import { colors } from "./colors";
import { shadows } from "./shadows";
import { Text } from "./Text";
import { AlbumCover } from "./AlbumCover";

/**
 * AlbumCard — a card for an album in a wishlist/collection list.
 *
 * - Not purchased: pass `coverImage` for the album art; a flat grey
 *   placeholder shows if it's not provided yet.
 * - Purchased: shows the real VinylRecord3D instead of cover art. It's
 *   rendered non-interactive here — list cards shouldn't let you drag the
 *   camera into some random orbit and leave it stuck there.
 */
export function AlbumCard({
  title,
  artist,
  isPurchased = false,
  coverImage,
  discColor = "#0a0a0a",
  width = 115,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width,
        boxSizing: "border-box",
        background: colors.background.white,
        borderRadius: 4,
        boxShadow: shadows.subtle,
        padding: "8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: onClick ? "pointer" : undefined,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <AlbumCover
          coverImage={coverImage}
          isPurchased={isPurchased}
          discColor={discColor}
          radius={isPurchased ? 2 : 0}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Text size="small" color={colors.text.secondary}>
            {title}
          </Text>
          <Text size="small" isAccent>
            {artist}
          </Text>
        </div>
      </div>
    </div>
  );
}
