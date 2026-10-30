import { Text } from "./Text";

export default {
  title: "Design System/Text",
  component: Text,
  parameters: {
    layout: "centered",
    backgrounds: { default: "white", values: [{ name: "white", value: "#ffffff" }] },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["metadata", "small", "medium", "large"],
    },
    weight: {
      control: { type: "select" },
      options: [undefined, 400, 500, 700],
    },
    color: { control: "color" },
    isAccent: { control: "boolean" },
  },
  args: {
    size: "metadata",
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Default = {};

export const AllSizes = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Object.keys(Text.sizes).map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <Text size="small" color="#9a9a9a" style={{ width: 80 }}>
            {size} / {Text.sizes[size]}px
          </Text>
          <Text size={size}>The quick brown fox jumps over the lazy dog</Text>
        </div>
      ))}
    </div>
  ),
};

export const Accent = {
  args: { isAccent: true, size: "medium" },
};

export const Playground = {};
