import { colors } from "./colors";
import { Text } from "./Text";

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const name = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [[name, value]] : flatten(value, name);
  });
}

function Swatch({ name, value }) {
  const isLight = /^#f|^#e|white/i.test(value) || value.includes("rgba(0, 0, 0, 0.4)");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          background: value,
          boxShadow: isLight ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : "none",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Text size="medium" weight={500} style={{ fontFamily: "monospace" }}>
          {name}
        </Text>
        <Text size="small" color="#8a8a8a" style={{ fontFamily: "monospace" }}>
          {value}
        </Text>
      </div>
    </div>
  );
}

export default {
  title: "Design System/Colors",
  parameters: {
    layout: "padded",
    backgrounds: { default: "white", values: [{ name: "white", value: "#ffffff" }] },
  },
};

export const AllTokens = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
      {flatten(colors).map(([name, value]) => (
        <Swatch key={name} name={name} value={value} />
      ))}
    </div>
  ),
};
