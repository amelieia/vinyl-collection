import { VinylRecord3D } from "./VinylRecord3D";
import { coverArt } from "./labelArt";

const ART = {
  sunset: coverArt([
    ["0", "#ffb86b"],
    ["1", "#ff5e8e"],
  ]),
  ocean: coverArt([
    ["0", "#2ec4b6"],
    ["1", "#1a2a6c"],
  ]),
  mono: coverArt([
    ["0", "#3a3a3a"],
    ["1", "#0a0a0a"],
  ]),
};

export default {
  title: "Components/VinylRecord3D",
  component: VinylRecord3D,
  parameters: {
    layout: "centered",
    backgrounds: { default: "white", values: [{ name: "white", value: "#ffffff" }] },
  },
  argTypes: {
    size: { control: { type: "range", min: 160, max: 600, step: 10 } },
    discColor: { control: "color" },
  },
  args: {
    size: 360,
    discColor: "#0a0a0a",
    label: ART.sunset,
  },
};

export const Default = {};

export const ColoredVinyl = {
  args: {
    discColor: "#7a1f2b",
    label: ART.mono,
  },
};

export const NoLabelImage = {
  args: {
    label: undefined,
  },
};

export const Sizes = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 32 }}>
      {[180, 300, 460].map((size) => (
        <VinylRecord3D key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Playground = {};
