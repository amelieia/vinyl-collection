import { StatusBadge } from "./StatusBadge";
import { colors } from "./colors";

export default {
  title: "Components/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "padded",
    backgrounds: { default: "page", values: [{ name: "page", value: colors.background.page }] },
  },
  argTypes: {
    isPurchased: { control: "boolean" },
  },
  args: {
    date: "02/02/26",
    isPurchased: false,
  },
  render: (args) => (
    <div style={{ width: 214 }}>
      <StatusBadge {...args} />
    </div>
  ),
};

export const WishedFor = {};

export const Purchased = {
  args: { isPurchased: true },
};

export const Both = {
  render: (args) => (
    <div style={{ width: 214, display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusBadge {...args} isPurchased={false} />
      <StatusBadge {...args} isPurchased={true} />
    </div>
  ),
};

export const Playground = {};
