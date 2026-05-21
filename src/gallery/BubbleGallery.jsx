import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const IMAGES = [
  "WhatsApp Image 2026-05-21 at 12.50.24 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.15 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.15 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.15 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (10).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (11).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (12).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (13).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (14).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (15).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (16).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (17).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (18).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (19).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (20).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (21).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (22).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (23).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (24).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (25).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (26).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (27).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (28).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (29).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (3).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (30).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (31).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (32).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (33).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (34).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (35).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (36).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (4).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (5).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (6).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (7).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (8).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM (9).jpeg",
  "WhatsApp Image 2026-05-21 at 3.16.19 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.17.59 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.00 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.00 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.00 PM (3).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.00 PM (4).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.00 PM (5).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.00 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (10).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (11).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (12).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (13).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (14).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (15).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (16).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (17).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (18).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (19).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (20).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (21).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (22).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (23).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (24).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (25).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (3).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (4).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (5).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (6).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (7).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (8).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM (9).jpeg",
  "WhatsApp Image 2026-05-21 at 3.18.01 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.51 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.51 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.51 PM (3).jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.51 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.52 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.57 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.21.58 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.03 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.03 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.17 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.18 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.18 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.19 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.19 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.24 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.25 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.25 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.30 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.31 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.32 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.32 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.32 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.34 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.34 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.35 PM (1).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.35 PM (2).jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.35 PM.jpeg",
  "WhatsApp Image 2026-05-21 at 3.22.36 PM.jpeg",
];

const BUBBLE_COUNT = 5;

const rand = (min, max) => Math.random() * (max - min) + min;

const pickRandom = (list, exclude = []) => {
  const pool = list.filter((item) => !exclude.includes(item));
  if (pool.length === 0) return list[Math.floor(Math.random() * list.length)];
  return pool[Math.floor(Math.random() * pool.length)];
};

const buildImageUrl = (name) => `/figures/${encodeURIComponent(name)}`;

const buildBubble = ({ id, name, bounds, existing }) => {
  const isCompact = bounds.width < 520 || bounds.height < 520;
  const minSize = isCompact ? 110 : 180;
  const maxSize = isCompact ? 160 : 240;
  const size = rand(minSize, maxSize);
  const padding = 20;
  const maxX = Math.max(padding, bounds.width - size - padding);
  const maxY = Math.max(padding, bounds.height - size - padding);

  let attempt = 0;
  let x = rand(padding, maxX);
  let y = rand(padding, maxY);

  const maxOverlap = 0.3;
  const area = size * size;

  const overlapRatio = (candidate, other) => {
    const x1 = Math.max(candidate.x, other.x);
    const y1 = Math.max(candidate.y, other.y);
    const x2 = Math.min(candidate.x + candidate.size, other.x + other.size);
    const y2 = Math.min(candidate.y + candidate.size, other.y + other.size);
    if (x2 <= x1 || y2 <= y1) return 0;
    const overlap = (x2 - x1) * (y2 - y1);
    const minArea = Math.min(candidate.size * candidate.size, other.size * other.size);
    return overlap / minArea;
  };

  while (attempt < 40 && existing?.length) {
    const candidate = { x, y, size };
    const tooClose = existing.some((other) => overlapRatio(candidate, other) > maxOverlap);
    if (!tooClose) break;
    x = rand(padding, maxX);
    y = rand(padding, maxY);
    attempt += 1;
  }

  return {
    id,
    name,
    size,
    x,
    y,
  };
};

export const BubbleGallery = () => {
  const containerRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const tapRefs = useRef({});

  const bounds = useMemo(() => {
    const el = containerRef.current;
    if (!el) return { width: 0, height: 0 };
    return { width: el.clientWidth, height: el.clientHeight };
  }, [containerRef.current]);

  const createInitial = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const current = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const name = pickRandom(IMAGES, current.map((item) => item.name));
      current.push(
        buildBubble({
          id: `bubble-${Date.now()}-${i}`,
          name,
          bounds: { width: el.clientWidth, height: el.clientHeight },
          existing: current,
        })
      );
    }
    setBubbles(current);
  }, []);

  useEffect(() => {
    createInitial();
    const onResize = () => {
      setBubbles((prev) => {
        const el = containerRef.current;
        if (!el) return prev;
        return prev.map((bubble, index) =>
          buildBubble({
            id: bubble.id,
            name: bubble.name,
            bounds: { width: el.clientWidth, height: el.clientHeight },
            existing: prev.filter((item, idx) => idx !== index),
          })
        );
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [createInitial]);

  const replaceBubble = useCallback((id) => {
    setBubbles((prev) => {
      const el = containerRef.current;
      if (!el) return prev;
      const used = prev.map((bubble) => bubble.name);
      return prev.map((bubble) =>
        bubble.id === id
          ? buildBubble({
              id: `bubble-${Date.now()}`,
              name: pickRandom(IMAGES, used),
              bounds: { width: el.clientWidth, height: el.clientHeight },
              existing: prev.filter((item) => item.id !== bubble.id),
            })
          : bubble
      );
    });
  }, []);

  const [popping, setPopping] = useState({});

  const handleTap = (bubble) => {
    const now = performance.now();
    const last = tapRefs.current[bubble.id] || 0;
    if (now - last < 260) {
      tapRefs.current[bubble.id] = 0;
      setActiveImage(null);
      setPopping((prev) => ({ ...prev, [bubble.id]: true }));
      return;
    }
    tapRefs.current[bubble.id] = now;
    setTimeout(() => {
      if (tapRefs.current[bubble.id] === now) {
        setActiveImage(buildImageUrl(bubble.name));
      }
    }, 220);
  };

  return (
    <section id="gallery" className="bubble-section">
      <div className="bubble-title">
        <h2>Bubble Gallery</h2>
        <p>Tap to view, double-tap to burst</p>
      </div>
      <div className="bubble-stage" ref={containerRef}>
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            className={`bubble ${popping[bubble.id] ? "bubble-pop" : "bubble-float"}`}
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              "--x": `${bubble.x}px`,
              "--y": `${bubble.y}px`,
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              handleTap(bubble);
            }}
            onAnimationEnd={() => {
              if (popping[bubble.id]) {
                setPopping((prev) => {
                  const next = { ...prev };
                  delete next[bubble.id];
                  return next;
                });
                replaceBubble(bubble.id);
              }
            }}
          >
            <img src={buildImageUrl(bubble.name)} alt="Bubble" />
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="bubble-modal"
          onClick={() => setActiveImage(null)}
        >
          <img src={activeImage} alt="Full" />
        </div>
      )}
    </section>
  );
};
