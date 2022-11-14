import { Canvas } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState } from "react";
import { Vector3 } from "three";

function Line({ start, end, color }) {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([new Vector3(...start), new Vector3(...end)]);
  }, [start, end]);
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  );
}

function NormalLines({ sx, ex, sy, ey, sz, ez, dx, dy, color }) {
  const dfx = (sx - ex) / dx;
  const dfy = (sy - ey) / dy;
  return Array(dx + 1)
    .fill(ex)
    .flatMap((v, i) => {
      const vx = v + dfx * i;
      return Array(dy + 1)
        .fill(ey)
        .map((v, j) => {
          const vy = v + dfy * j;
          return (
            <Line key={`${i}${j}`} start={[vx, vy, sz]} end={[vx, vy, ez]} color={color} />
          );
        });
    });
}

function VerticalLines({ sx, ex, sy, ey, z, d, color }) {
  const df = (sx - ex) / d;
  return Array(d + 1)
    .fill(ex)
    .map((v, i) => {
      const vx = v + df * i;
      return <Line key={i} start={[vx, sy, z]} end={[vx, ey, z]} color={color} />;
    });
}

function HorizontalLines({ sx, ex, sy, ey, z, d, color }) {
  const df = (sy - ey) / d;
  return Array(d + 1)
    .fill(ey)
    .map((v, i) => {
      const vy = v + df * i;
      return <Line key={i} start={[sx, vy, z]} end={[ex, vy, z]} color={color} />;
    });
}

function GameGrid({ sx, ex, sy, ey, sz, ez, dx, dy, color }) {
  return (
    <group>
      <VerticalLines sx={sx} ex={ex} sy={sy} ey={ey} z={sz} d={dx} color={color} />
      <HorizontalLines sx={sx} ex={ex} sy={sy} ey={ey} z={sz} d={dy} color={color} />
      <VerticalLines sx={sx} ex={ex} sy={sy} ey={ey} z={ez} d={dx} color={color} />
      <HorizontalLines sx={sx} ex={ex} sy={sy} ey={ey} z={ez} d={dy} color={color} />
      <NormalLines
        sx={sx}
        ex={ex}
        sy={sy}
        ey={ey}
        sz={sz}
        ez={ez}
        dx={dx}
        dy={dy}
        color={color}
      />
    </group>
  );
}

export default function App() {
  const [colour, setColour] = useState(0);
  return (
    <>
      <Canvas frameloop="demand">
        <GameGrid
          sx={1.8}
          ex={-1.8}
          sy={2.7}
          ey={-2.7}
          sz={0}
          ez={-0.3}
          dx={6}
          dy={8}
          color={Colors[colour]}
        />
      </Canvas>
      <button onClick={() => setColour((c) => (c + 1) % Colors.length)}>Next</button>
    </>
  );
}

// g,b,r,y,o,p,c,w
const Colors = [
  "#ff0e0e",
  "#00ff16",
  "#2900ff",
  "#faff20",
  "#ff8f00",
  "#fd00ff",
  "#03ffd3",
  "#ffffff"
];
