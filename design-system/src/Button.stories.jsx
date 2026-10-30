import { Button } from "./Button";
import { colors } from "./colors";
import { Text } from "./Text";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "padded",
    backgrounds: { default: "page", values: [{ name: "page", value: colors.background.page }] },
  },
  argTypes: {
    size: { control: "select", options: Object.keys(Text.sizes) },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Add to wishlist",
    size: "medium",
    disabled: false,
  },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true },
};

export const Sizes = {
  render: (args) => (
    <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
      {Object.keys(Text.sizes).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Playground = {};
