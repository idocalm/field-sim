import { Charge } from "./field-lines";
import { useMemo } from "react";
import { Text } from "@react-three/drei"; // Import Text from drei
import { useThree } from "@react-three/fiber";

interface ParticlesProps {
  particles: Charge[];
}

const Particles: React.FC<ParticlesProps> = ({ particles }) => {
  const camera = useThree((state) => state.camera); // Get the camera
  // Memoize the particle meshes for performance
  const particleMeshes = useMemo(
    () =>
      particles.map((particle, index) => (
        <mesh
          key={index}
          position={[
            particle.position?.x || 0,
            particle.position?.y || 0,
            particle.position?.z || 0,
          ]}
        >
          <sphereGeometry args={[(0.5 * particle.charge) / 2, 32, 32]} />
          <meshBasicMaterial
            color={particle.type === "positive" ? "blue" : "red"}
            transparent
            opacity={1}
          />
          <group
            position={[0, 1, 0]} // Position label above the particle
            quaternion={camera.quaternion} // Align to camera
          >
            <Text
              fontSize={0.5}
              color={particle.type === "positive" ? "blue" : "red"}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {particle.type === "positive" ? "Positive" : "Negative"}
            </Text>
          </group>
        </mesh>
      )),
    [particles], // Recreate meshes only when particles change
  );

  return <>{particleMeshes}</>;
};

export default Particles;
