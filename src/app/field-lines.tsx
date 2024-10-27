import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

export interface Charge {
  type: "positive" | "negative";
  charge: number;
  position: THREE.Vector3; // Position of the charge
  name: string;
}

interface FieldLineProps {
  particles: Charge[];
}

const FieldLines: React.FC<FieldLineProps> = ({ particles }) => {
  // Constants
  const k = 8.99e9; // Coulomb's constant (N m²/C²)

  // Function to calculate electric field vector at a point
  const calculateElectricField = (position: THREE.Vector3) => {
    const field = new THREE.Vector3(0, 0, 0);

    particles.forEach((particle) => {
      const r = position.clone().sub(particle.position); // Vector from the particle to the point

      const distance = r.length();
      if (distance > 0) {
        const unitVector = r.normalize();
        const magnitude = (k * particle.charge) / (distance * distance);
        const electricField = unitVector.multiplyScalar(magnitude);
        field.add(electricField);
      }
    });

    return field;
  };

  // Create field lines
  const lines = useMemo(() => {
    const lineLength = 400; // Length of the lines
    const increment = 0.2; // Increment for the length of the lines
    const fieldLines: JSX.Element[] = [];

    particles.forEach((particle) => {
      const { position } = particle;
      for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 3) {
        for (let phi = 0; phi < Math.PI; phi += Math.PI / 6) {
          const direction = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi),
          );

          const startPoint = position
            .clone()
            .add(direction.clone().normalize().multiplyScalar(0.3));
          const currentPoint = startPoint.clone();

          const points = [currentPoint.clone()];

          for (let k = 0; k < lineLength; k++) {
            const electricField = calculateElectricField(currentPoint);
            currentPoint.add(
              electricField.clone().normalize().multiplyScalar(increment),
            );
            points.push(currentPoint.clone());
          }

          // Create a line component
          fieldLines.push(
            <Line
              key={`${particle.type}-${theta}-${phi}`} // Unique key for each line
              points={points}
              opacity={0.8}
              transparent
              depthWrite={false}
              color={"white"}
              lineWidth={2}
            />,
          );
        }
      }
    });

    return fieldLines;
  }, [particles]);

  return <>{lines}</>; // Render lines as children
};

export default FieldLines;
