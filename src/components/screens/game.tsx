import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils/cn";
import { IconButton } from "../shared/button";

const KEYS = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
} as const;

const handleOutOfBounds = (value: number, max: number) => {
  if (value < 0) return max - 1;
  else if (value > max - 1) return 0;
  return value;
};

type Vec2 = { x: number; y: number };
type Snake = Vec2[];

const createGrid = (w: number, h: number) => {
  const grid: number[][] = [];

  for (let i = 0; i < h; i++) {
    grid.push([]);
    for (let j = 0; j < w; j++) {
      grid[i].push(0);
    }
  }

  return grid;
};

type GameScreenProps = {
  show: boolean;
};

export function GameScreen({ show }: GameScreenProps) {
  const width = 24;
  const height = 24;

  const [grid, setGrid] = useState(createGrid(width, height));

  const snake = useRef<Snake>([
    {
      x: Math.floor(width / 2),
      y: Math.floor(height / 2),
    },
  ]);
  const vel = useRef<Vec2[]>([{ x: 1, y: 0 }]);
  const lastKeyPressAt = useRef<number>(Date.now());

  const setVel = (x: number, y: number, threshold = 200) => {
    const now = Date.now();

    console.log(now - lastKeyPressAt.current);

    if (now - lastKeyPressAt.current < threshold) {
      vel.current.push({ x, y });
    } else {
      vel.current = [{ x, y }];
    }

    lastKeyPressAt.current = now;
  };
  const setVelLeft = () => setVel(-1, 0);
  const setVelUp = () => setVel(0, -1);
  const setVelRight = () => setVel(1, 0);
  const setVelDown = () => setVel(0, 1);

  useEffect(() => {
    const tick = () => {
      if (show) return;

      const newGrid = createGrid(width, height);

      snake.current = snake.current.map((cell) => {
        const v = vel.current[0];

        if (vel.current.length > 1) {
          vel.current.splice(0, 1);
        }

        return {
          x: handleOutOfBounds(cell.x + v.x, width),
          y: handleOutOfBounds(cell.y + v.y, height),
        };
      });

      snake.current.forEach((cell) => {
        newGrid[cell.y][cell.x] = 1;
      });

      setGrid(newGrid);
    };

    const handle = setInterval(tick, 150);

    tick();

    const keyListener = (event: KeyboardEvent) => {
      if (event.key === KEYS.left) {
        setVelLeft();
      } else if (event.key === KEYS.up) {
        setVelUp();
      } else if (event.key === KEYS.right) {
        setVelRight();
      } else if (event.key === KEYS.down) {
        setVelDown();
      }
    };

    addEventListener("keyup", keyListener);

    return () => {
      clearInterval(handle);
      removeEventListener("keyup", keyListener);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "w-screen h-screen flex flex-col items-center justify-center gap-20 overflow-hidden fixed top-0 left-0 transition-all duration-500 delay-500",
        !show && "pointer-events-none opacity-0"
      )}
    >
      <div className="flex flex-col gap-1">
        {grid.map((row: number[], i) => (
          <div className="flex gap-1" key={i}>
            {row.map((cell, j) => (
              <div
                className={cn(
                  "size-4 transition-all duration-75",
                  cell ? "bg-white" : "bg-white/20"
                )}
                key={`${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center text-2xl">
        <IconButton icon={<>&uarr;</>} onClick={setVelUp} />
        <div className="flex gap-10">
          <IconButton icon={<>&larr;</>} onClick={setVelLeft} />
          <IconButton icon={<>&rarr;</>} onClick={setVelRight} />
        </div>
        <IconButton icon={<>&darr;</>} onClick={setVelDown} />
      </div>
    </div>
  );
}
