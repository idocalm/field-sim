"use client";
import { Canvas } from "@react-three/fiber";
import FieldLines, { type Charge } from "./field-lines";
import { OrbitControls } from "@react-three/drei"; // For camera controls
import Controls from "./controls";
import { Vector3 } from "three";
import Particles from "./particles";
import { useState } from "react";

export default function HomePage() {
  const [particles, setParticles] = useState<Charge[]>([
    {
      type: "negative",
      charge: -1,
      position: new Vector3(4, 0, 0),
      name: "Negative charge #1",
    },
    {
      type: "positive",
      charge: 1,
      position: new Vector3(-4, 0, 0),
      name: "Positive charge #1",
    },
  ]);

  return (
    <main className="h-screen w-screen bg-zinc-950 text-white">
      <Controls
        onNewParticle={(position, type, charge, name) => {
          const signedCharge = type === "positive" ? charge : -charge;
          setParticles([
            ...particles,
            {
              type,
              charge: signedCharge,
              position,
              name,
            },
          ]);
        }}
        onRemoveParticle={(index) => {
          const newParticles = [...particles];
          newParticles.splice(index, 1);
          setParticles(newParticles);
        }}
        particles={particles}
      />
      <Canvas shadows style={{ height: "100vh", width: "100vw" }}>
        <OrbitControls />
        <Particles particles={particles} />
        <FieldLines particles={particles} />
      </Canvas>
    </main>
  );
}
