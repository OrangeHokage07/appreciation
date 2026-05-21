import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Book } from "./Book";
export const Experience = () => {
  const { viewport } = useThree();
  const bookScale = useMemo(() => {
    const scaleByWidth = viewport.width / 2.6;
    const scaleByHeight = viewport.height / 2.4;
    return Math.max(0.9, Math.min(scaleByWidth, scaleByHeight));
  }, [viewport.width, viewport.height]);

  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={1}
        speed={2}
        rotationIntensity={2}
      >
        <Book scale={bookScale} />
      </Float>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={1.2} />
      <Environment preset="studio" intensity={0}></Environment>
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
