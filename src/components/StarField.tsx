function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_COUNT = 340;
const SEED = 42;

export default function StarField() {
  const rng = mulberry32(SEED);

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const x = rng() * 100;       // % left
    const y = rng() * 100;       // % top
    const size = rng() * 1.4 + 0.4; // px
    const opacity = rng() * 0.5 + 0.15;
    const twinkleDelay = rng() * 6; // seconds
    const twinkleDuration = rng() * 3 + 2; // seconds

    return (
      <div
        key={i}
        className="star-dot"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          animationDelay: `${twinkleDelay}s`,
          animationDuration: `${twinkleDuration}s`,
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Wrapper that drifts all stars together in one direction */}
      <div className="star-field-drift w-[120%] h-[120%] -ml-[10%] -mt-[10%] relative">
        {stars}
      </div>
    </div>
  );
}
