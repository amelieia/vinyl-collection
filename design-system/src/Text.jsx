import { colors } from "./colors";

// Typography primitive — body text only, no headings. Four sizes, Satoshi
// throughout, line-height always 132% of the text's own size. Scaled up to
// regular mobile body-text conventions (16px baseline, not the original
// 8px desktop-density scale) while keeping each step's relative order.
const SIZES = {
  metadata: 12,
  small: 14,
  medium: 16,
  large: 20,
};

const FONT_FAMILY = "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LINE_HEIGHT = 1.32;

export function Text({
  size = "metadata",
  as: Tag = "span",
  weight = 500,
  color,
  isAccent = false,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      style={{
        fontFamily: FONT_FAMILY,
        fontSize: SIZES[size],
        lineHeight: LINE_HEIGHT,
        fontWeight: weight,
        color: isAccent ? colors.accent : color,
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Text.sizes = SIZES;
