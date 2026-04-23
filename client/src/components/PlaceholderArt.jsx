// Generates a unique, colorful SVG placeholder based on a seed string.
// Each name gets a distinct gradient + geometric pattern.

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const PALETTES = [
  ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
  ['#2d132c', '#801336', '#c72c41', '#ee4540'],
  ['#0b0c10', '#1f2833', '#45a29e', '#66fcf1'],
  ['#1b262c', '#0f4c75', '#3282b8', '#bbe1fa'],
  ['#222831', '#393e46', '#00adb5', '#eeeeee'],
  ['#2c003e', '#512b58', '#8174a0', '#a3c4bc'],
  ['#1a1a2e', '#e94560', '#533483', '#0f3460'],
  ['#0d1b2a', '#1b263b', '#415a77', '#778da9'],
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c'],
  ['#003049', '#d62828', '#f77f00', '#fcbf49'],
  ['#10002b', '#240046', '#3c096c', '#7b2cbf'],
  ['#582f0e', '#7f4f24', '#936639', '#a68a64'],
];

export default function PlaceholderArt({ name = '', size, className = '', style = {} }) {
  const h = hashStr(name || 'default');
  const palette = PALETTES[h % PALETTES.length];
  const angle = (h % 360);
  const patternType = h % 5;
  const letter = (name || '?').charAt(0).toUpperCase();

  const shapes = [];

  if (patternType === 0) {
    // Circles
    for (let i = 0; i < 5; i++) {
      const cx = ((h * (i + 3) * 17) % 80) + 10;
      const cy = ((h * (i + 7) * 13) % 80) + 10;
      const r = ((h * (i + 1)) % 25) + 8;
      shapes.push(
        <circle key={i} cx={cx} cy={cy} r={r} fill={palette[(i + 1) % palette.length]} opacity="0.5" />
      );
    }
  } else if (patternType === 1) {
    // Diagonal stripes
    for (let i = 0; i < 8; i++) {
      const x = i * 16 - 10;
      shapes.push(
        <rect key={i} x={x} y="-10" width="8" height="140" fill={palette[(i + 1) % palette.length]} opacity="0.35" transform={`rotate(${35 + (h % 30)}, 50, 50)`} />
      );
    }
  } else if (patternType === 2) {
    // Grid of dots
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const r = ((h * (x + y + 1)) % 4) + 2;
        shapes.push(
          <circle key={`${x}-${y}`} cx={10 + x * 20} cy={10 + y * 20} r={r} fill={palette[(x + y) % palette.length]} opacity="0.6" />
        );
      }
    }
  } else if (patternType === 3) {
    // Large overlapping rects
    for (let i = 0; i < 4; i++) {
      const x = ((h * (i + 2) * 11) % 60) - 10;
      const y = ((h * (i + 5) * 7) % 60) - 10;
      const w = ((h * (i + 1)) % 40) + 20;
      shapes.push(
        <rect key={i} x={x} y={y} width={w} height={w} rx="4" fill={palette[(i + 1) % palette.length]} opacity="0.4" transform={`rotate(${(h * (i + 1)) % 45}, ${x + w / 2}, ${y + w / 2})`} />
      );
    }
  } else {
    // Triangles
    for (let i = 0; i < 4; i++) {
      const cx = ((h * (i + 3) * 19) % 80) + 10;
      const cy = ((h * (i + 7) * 11) % 80) + 10;
      const s = ((h * (i + 1)) % 20) + 12;
      const points = `${cx},${cy - s} ${cx - s},${cy + s} ${cx + s},${cy + s}`;
      shapes.push(
        <polygon key={i} points={points} fill={palette[(i + 2) % palette.length]} opacity="0.45" />
      );
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{
        width: size || '100%',
        height: size || '100%',
        aspectRatio: '1/1',
        display: 'block',
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`grad-${h}`} x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`rotate(${angle})`}>
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#grad-${h})`} />
      {shapes}
      <text
        x="50"
        y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.7)"
        fontFamily="'Caveat', cursive"
        fontSize="32"
        fontWeight="700"
      >
        {letter}
      </text>
    </svg>
  );
}
