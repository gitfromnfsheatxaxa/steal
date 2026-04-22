"use client";

export function AmbientGymLayer() {
  return (
    <div aria-hidden="true" className="ambient-gym-layer">
      <div className="ambient-gym-layer__blob ambient-gym-layer__blob--primary" />
      <div className="ambient-gym-layer__blob ambient-gym-layer__blob--secondary" />
      <div className="ambient-gym-layer__blob ambient-gym-layer__blob--tertiary" />
      <div className="ambient-gym-layer__grid" />
      <div className="ambient-gym-layer__noise" />
    </div>
  );
}
