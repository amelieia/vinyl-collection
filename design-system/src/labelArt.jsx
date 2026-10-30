// Shared label/art helpers used across the vinyl components and their
// Storybook stories — kept separate so they don't depend on any one
// specific vinyl component (CSS or 3D).

export function LabelText({ title, subtitle, color = "#20331d" }) {
  return (
    <div style={{ textAlign: "center", color, padding: "0 10%" }}>
      <div style={{ fontSize: "0.11em", fontWeight: 700, letterSpacing: 1 }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: "0.09em", opacity: 0.75, marginTop: 4, letterSpacing: 0.5 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export function coverArt(stops) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        ${stops.map(([offset, c]) => `<stop offset='${offset}' stop-color='${c}'/>`).join("")}
      </linearGradient>
    </defs>
    <rect width='200' height='200' fill='url(#g)'/>
    <circle cx='100' cy='70' r='34' fill='rgba(255,255,255,0.18)'/>
    <circle cx='60' cy='140' r='50' fill='rgba(0,0,0,0.12)'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
