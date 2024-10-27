import { useState } from "react";
import { Vector3 } from "three";
import type { Charge } from "./field-lines";

interface ControlsProps {
  onNewParticle: (
    position: Vector3,
    type: "positive" | "negative",
    charge: number,
    name: string,
  ) => void;
  onRemoveParticle: (index: number) => void;
  particles: Charge[];
}

const Controls: React.FC<ControlsProps> = ({
  onNewParticle,
  onRemoveParticle,
  particles,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [charge, setCharge] = useState(1);
  const [type, setType] = useState<"positive" | "negative">("positive");
  const [position, setPosition] = useState(new Vector3(0, 0, 0));
  const [chargeName, setChargeName] = useState("New charge");

  return (
    <div className="absolute right-0 z-[1] m-4 flex h-3/4 flex-col rounded-lg bg-white p-4 text-black shadow-lg">
      <h1 className="text-rtl text-2xl font-extrabold tracking-tighter">
        Settings
      </h1>

      {showPopup && (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-8">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
            <h1 className="text-2xl font-bold tracking-tighter">
              Add particle
            </h1>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold tracking-tight">
                Type
              </label>
              <div className="flex gap-4">
                <button
                  className={`w-1/2 rounded-lg bg-stone-800 px-2 py-1 text-white ${
                    type === "positive" ? "bg-green-500" : ""
                  }`}
                  onClick={() => setType("positive")}
                >
                  Positive
                </button>
                <button
                  className={`w-1/2 rounded-lg bg-stone-800 px-2 py-1 text-white ${
                    type === "negative" ? "bg-red-500" : ""
                  }`}
                  onClick={() => setType("negative")}
                >
                  Negative
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold tracking-tight">
                Charge
              </label>
              <input
                type="number"
                value={charge}
                onChange={(e) => setCharge(parseInt(e.target.value))}
                className="rounded-lg border-2 border-gray-300 p-2"
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold tracking-tight">
                Name
              </label>
              <input
                type="text"
                value={chargeName}
                onChange={(e) => setChargeName(e.target.value)}
                className="rounded-lg border-2 border-gray-300 p-2"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold tracking-tight">
                Position
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={position.x}
                  onChange={(e) =>
                    setPosition(
                      new Vector3(
                        parseFloat(e.target.value),
                        position.y,
                        position.z,
                      ),
                    )
                  }
                  className="w-1/3 rounded-lg border-2 border-gray-300 p-2"
                />
                <input
                  type="number"
                  value={position.y}
                  onChange={(e) =>
                    setPosition(
                      new Vector3(
                        position.x,
                        parseFloat(e.target.value),
                        position.z,
                      ),
                    )
                  }
                  className="w-1/3 rounded-lg border-2 border-gray-300 p-2"
                />
                <input
                  type="number"
                  value={position.z}
                  onChange={(e) =>
                    setPosition(
                      new Vector3(
                        position.x,
                        position.y,
                        parseFloat(e.target.value),
                      ),
                    )
                  }
                  className="w-1/3 rounded-lg border-2 border-gray-300 p-2"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="w-1/2 rounded-lg bg-stone-800 px-2 py-1 text-white"
                onClick={() => {
                  setShowPopup(false);
                  onNewParticle(position, type, charge, chargeName);
                }}
              >
                Add
              </button>
              <button
                className="w-1/2 rounded-lg bg-stone-800 px-2 py-1 text-white"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex h-full w-full flex-col gap-3">
        <label className="text-rtl text-lg font-semibold tracking-tight">
          Current amount of particles: {particles.length}
        </label>
        <div className="relative h-full w-full">
          {
            <div className="flex h-full flex-col gap-3 overflow-y-auto">
              {particles.map((particle, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 rounded-lg bg-stone-800 p-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full ${
                        particle.type === "positive"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <p className="text-white">{particle.name}</p>
                    <p className="text-white">{particle.charge} C</p>
                    <p className="text-white">
                      X: {particle.position.x.toFixed(2)}
                    </p>
                    <p className="text-white">
                      Y: {particle.position.y.toFixed(2)}
                    </p>
                    <p className="text-white">
                      Z: {particle.position.z.toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="h-8 rounded-sm bg-stone-500 px-8 text-white"
                    onClick={() => onRemoveParticle(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          }
          <div className="absolute bottom-0 flex w-full gap-3">
            <button
              className="w-28 rounded-lg bg-stone-800 px-2 py-1 text-white"
              onClick={() => {
                setShowPopup(true);
              }}
            >
              New
            </button>
            <input
              disabled
              type="number"
              value={particles.length}
              className="w-full rounded-lg border-2 border-gray-300 p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
