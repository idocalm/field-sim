import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

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

  // Create field lines and arrows
  const lines = useMemo(() => {
    const arrowFrequency = 40; // Distance between arrows
    const arrowSize = 1.4; // Size of the arrows
    const fieldLines: JSX.Element[] = [];

    particles.forEach((particle) => {
      const { position } = particle;

      const farthestPoint = particles.reduce((max, p) => {
        const distance = p.position.distanceTo(position);
        console.log(distance);
        return distance > max ? distance : max;
      }, 0);

      console.log(farthestPoint);

      const increment = farthestPoint / 100;

      if (particle.type === "positive") {
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
            const arrowPositions = []; // Store positions for the arrows

            for (let k = 0; k < farthestPoint * 100; k++) {
              const electricField = calculateElectricField(currentPoint);

              let closestParticle;
              let closestDistance;
              for (particle of particles) {
                const r = currentPoint.clone().sub(particle.position);

                const distance = r.length();
                if (!closestDistance || distance < closestDistance) {
                  closestParticle = particle;
                  closestDistance = distance;
                  break;
                }
              }

              if (closestParticle != particle) {
                if (closestDistance && closestDistance < 0.5) {
                  break;
                }
              }

              const nextPoint = currentPoint
                .clone()
                .add(
                  electricField.clone().normalize().multiplyScalar(increment),
                );

              points.push(nextPoint.clone());

              // Add an arrow every `arrowFrequency` increments
              if (k % arrowFrequency === 0) {
                console.log("Adding arrow, distance: ", closestDistance);
                if (closestDistance && closestDistance < 0.5) {
                  break;
                }

                arrowPositions.push({
                  position: nextPoint.clone(),
                  direction: electricField.clone().normalize(),
                });
              }

              currentPoint.copy(nextPoint);
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

            arrowPositions.forEach(({ position, direction }, index) => {
              fieldLines.push(
                <arrowHelper
                  key={`${particle.type}-${theta}-${phi}-${index}`} // Unique key for each arrow
                  args={[direction, position, arrowSize, "yellow"]}
                />,
              );
            }); // Add arrows along the field line
          }
        }
      }
    });

    return fieldLines;
  }, [particles]);

  return <>{lines}</>; // Render lines as children
};

export default FieldLines;
