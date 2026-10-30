import { VinylCover } from "./VinylCover";
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
  title: "Components/VinylCover",
  component: VinylCover,
  parameters: {
    layout: "centered",
    backgrounds: { default: "white", values: [{ name: "white", value: "#ffffff" }] },
  },
  argTypes: {
    size: { control: { type: "range", min: 100, max: 500, step: 10 } },
    radius: { control: { type: "range", min: 0, max: 40, step: 1 } },
    color: { control: "color" },
    tiltMax: { control: { type: "range", min: 0, max: 30, step: 1 } },
    sheenOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    sheenAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
    sheenWidth: { control: { type: "range", min: 2, max: 60, step: 1 } },
    sheenFeather: { control: { type: "range", min: 2, max: 60, step: 1 } },
    springStiffness: { control: { type: "range", min: 40, max: 400, step: 10 } },
    springDamping: { control: { type: "range", min: 5, max: 40, step: 1 } },
  },
  args: {
    size: 300,
    radius: 6,
    color: "#d8d8d8",
    tiltMax: 12,
    sheenOpacity: 0.22,
    sheenAngle: 115,
    sheenWidth: 22,
    sheenFeather: 26,
    springStiffness: 140,
    springDamping: 18,
  },
};

export const Default = {
  render: (args) => (
    <VinylCover {...args}>
      <img src={ART.sunset} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </VinylCover>
  ),
};

export const PlainColor = {
  args: { color: "#7a1f2b" },
  render: (args) => <VinylCover {...args} />,
};

export const Gallery = {
  args: {
    tiltMax: 5
  },
  render:(args) => (
    <div style={{ display: "flex", gap: 32 }}>
      {Object.entries(ART).map(([key, src]) => (
        <VinylCover key={key} {...args} size={200}>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </VinylCover>
      ))}
    </div>
  )
};

export const Playground = {
  render: (args) => (
    <VinylCover {...args}>
      <img src={ART.ocean} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </VinylCover>
  ),
};
