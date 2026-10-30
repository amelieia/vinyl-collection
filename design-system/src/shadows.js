// Shadow tokens — pulled from the Figma reference frame (node 606:3382 for
// "subtle"; node 606:3810 for the two emboss pairs below).
export const shadows = {
  subtle:
    "0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.04)",
  // "Emboss / Lifted" — a dark shadow below + light highlight above, reading
  // as raised off the surface.
  lifted:
    "0px 1px 2.5px 0px rgba(0, 8, 21, 0.15), 0px -3px 4.3px 0px rgba(255, 255, 255, 1)",
  // "Embossed / Sunken" — the same pair turned inset, reading as pressed
  // into the surface.
  sunken:
    "inset 0px 1px 2.5px 0px rgba(0, 8, 21, 0.15), inset 0px -3px 4.3px 0px rgba(255, 255, 255, 1)",
};
