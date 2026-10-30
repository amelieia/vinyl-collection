import { AlbumCard } from "./AlbumCard";
import { coverArt } from "./labelArt";

const SUNSET = coverArt([
  ["0", "#ffb86b"],
  ["1", "#ff5e8e"],
]);
const OCEAN = coverArt([
  ["0", "#2ec4b6"],
  ["1", "#1a2a6c"],
]);

export default {
  title: "Components/AlbumCard",
  component: AlbumCard,
  parameters: {
    layout: "centered",
    backgrounds: { default: "page", values: [{ name: "page", value: "#ECEDED" }] },
  },
  argTypes: {
    isPurchased: { control: "boolean" },
    discColor: { control: "color" },
    width: { control: { type: "range", min: 80, max: 240, step: 5 } },
  },
  args: {
    title: "Charm",
    artist: "Clairo",
    isPurchased: false,
    coverImage: SUNSET,
  },
};

export const NotPurchased = {};

export const NotPurchasedNoImage = {
  args: { coverImage: undefined },
};

export const Purchased = {
  args: { isPurchased: true },
};

export const Grid = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <AlbumCard {...args} title="Charm" artist="Clairo" isPurchased={false} coverImage={SUNSET} />
      <AlbumCard
        {...args}
        title="Essex Honey"
        artist="Blood Orange"
        isPurchased={true}
        coverImage={OCEAN}
      />
      <AlbumCard {...args} title="No Art Yet" artist="Unknown" isPurchased={false} coverImage={undefined} />
    </div>
  ),
};

export const Playground = {};
