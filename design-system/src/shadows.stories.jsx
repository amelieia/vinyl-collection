import { shadows } from "./shadows";
import { colors } from "./colors";
import { Text } from "./Text";

function Swatch({ name, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <div
        style={{
          width: 160,
          height: 100,
          borderRadius: 8,
          background: colors.background.white,
          boxShadow: value,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Text size="medium" weight={500} style={{ fontFamily: "monospace" }}>
          {name}
        </Text>
        <Text size="small" color={colors.text.tertiary} style={{ fontFamily: "monospace", maxWidth: 320 }}>
          {value}
        </Text>
      </div>
    </div>
  );
}

export default {
  title: "Design System/Shadows",
  parameters: {
    layout: "padded",
    backgrounds: { default: "page", values: [{ name: "page", value: colors.background.page }] },
  },
};

export const AllTokens = {
  render: () => (
    <div style={{ display: "flex", gap: 32, padding: 24 }}>
      <Swatch name="Shadow / Subtle" value={shadows.subtle} />
      <Swatch name="Emboss / Lifted" value={shadows.lifted} />
      <Swatch name="Embossed / Sunken" value={shadows.sunken} />
    </div>
  ),
};
