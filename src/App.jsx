import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { GameSection } from "./game/GameSection";
import { BubbleGallery } from "./gallery/BubbleGallery";

function App() {
  const [showHero, setShowHero] = useState(true);
  const pageRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const container = pageRef.current;
      if (!container) return;
      const heroVisible = container.scrollTop < window.innerHeight * 0.6;
      setShowHero(heroVisible);
    };
    onScroll();
    const container = pageRef.current;
    if (!container) return undefined;
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page" ref={pageRef}>
      <section id="hero" className="hero-section">
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
      <GameSection />
      <BubbleGallery />
    </div>
  );
}

export default App;
