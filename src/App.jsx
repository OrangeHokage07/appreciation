import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { GameSection } from "./game/GameSection";
import { BubbleGallery } from "./gallery/BubbleGallery";

function App() {
  const [showHero, setShowHero] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const gameRef = useRef(null);
  const galleryRef = useRef(null);

  const tabs = useMemo(
    () => [
      { id: "hero", label: "Note" },
      { id: "game", label: "Game" },
      { id: "gallery", label: "Gallery" },
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => {
      const container = pageRef.current;
      if (!container) return;
      const heroVisible = container.scrollTop < window.innerHeight * 0.6;
      setShowHero(heroVisible);

      const sections = [
        heroRef.current,
        gameRef.current,
        galleryRef.current,
      ].filter(Boolean);
      if (!sections.length) return;
      const current = sections.reduce(
        (closest, section) => {
          const distance = Math.abs(section.offsetTop - container.scrollTop);
          return distance < closest.distance
            ? { id: section.id, distance }
            : closest;
        },
        { id: "hero", distance: Number.POSITIVE_INFINITY }
      );
      setActiveTab(current.id);
    };
    onScroll();
    const container = pageRef.current;
    if (!container) return undefined;
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page" ref={pageRef}>
      <nav className="screen-tabs" aria-label="Sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`screen-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              const target =
                tab.id === "hero"
                  ? heroRef.current
                  : tab.id === "game"
                  ? gameRef.current
                  : galleryRef.current;
              target?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <section id="hero" className="hero-section" ref={heroRef}>
        {showHero && <UI />}
        {showHero && <Loader />}
        {showHero && (
          <div className="hero-canvas">
            <Canvas
              shadows
              camera={{
                position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
                fov: 45,
              }}
            >
              <group position-y={0}>
                <Suspense fallback={null}>
                  <Experience />
                </Suspense>
              </group>
            </Canvas>
          </div>
        )}
      </section>
      <section id="game" ref={gameRef}>
        <GameSection />
      </section>
      <section id="gallery" ref={galleryRef}>
        <BubbleGallery />
      </section>
    </div>
  );
}

export default App;
