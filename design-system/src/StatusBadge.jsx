import { colors } from "./colors";
import { shadows } from "./shadows";
import { Text } from "./Text";

/**
 * StatusBadge — "Wished for" / "Purchased" pill with a date, as seen on a
 * wishlist item. The two states use opposite emboss directions: not-yet-
 * purchased reads as raised (shadows.lifted), purchased reads as pressed
 * into the surface (shadows.sunken) — a tactile cue that purchased is the
 * "settled" state.
 */
export function StatusBadge({ isPurchased = false, date }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: 24,
        padding: "4px 8px",
        borderRadius: 2,
        background: colors.background.surface,
        boxShadow: isPurchased ? shadows.sunken : shadows.lifted,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <Text size="small" color={colors.text.tertiary}>
        {isPurchased ? "Purchased" : "Wished for"}
      </Text>
      <Text size="small" isAccent>
        {date}
      </Text>
    </div>
  );
}
