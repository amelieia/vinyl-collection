import { colors } from "./colors";
import { Text } from "./Text";

/**
 * Button — a ghost button: no fill, no border, just default-color Text
 * inside a real <button> element (native click/keyboard/disabled behavior,
 * rather than a styled span).
 */
export function Button({ children, size = "medium", disabled = false, style, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      <Text size={size} color={colors.text.primary}>
        {children}
      </Text>
    </button>
  );
}
