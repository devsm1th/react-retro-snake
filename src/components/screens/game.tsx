import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils/cn";
import { Button, IconButton } from "../shared/button";
import { ArrowUp } from "../shared/icons/arrow-up";
import {
  createGrid,
  getEmptyPositions,
  getSnakePositions,
  handleOutOfBounds,
  isSamePosition,
  type Snake,
  type Vec2,
} from "../../lib/utils/helpers";
import { CELL, KEYS } from "../../lib/constants";
import { useSFX } from "../../lib/hooks/use-sfx";

type GameScreenProps = {
  show: boolean;
};

export function GameScreen({ show }: GameScreenProps) {
  const player = useSFX();

  const width = 24;
  const height = 24;

  const [grid, setGrid] = useState(createGrid(width, height));
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const snake = useRef<Snake>({
    positions: [
      {
        x: Math.floor(width / 2),
        y: Math.floor(height / 2),
      },
    ],
    length: 1,
  });
  const vel = useRef<Vec2[]>([{ x: 1, y: 0 }]);
  const lastKeyPressAt = useRef<number>(Date.now());
  const ticksCount = useRef<number>(0);
  const apple = useRef<Vec2 | null>(null);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    snake.current = {
      positions: [
        {
          x: Math.floor(width / 2),
          y: Math.floor(height / 2),
        },
      ],
      length: 1,
    };
    vel.current = [{ x: 1, y: 0 }];
    ticksCount.current = 0;
    apple.current = null;
  }, []);

  const setVel = (x: number, y: number, threshold = 200) => {
    const now = Date.now();

    const head = snake.current.positions.at(-1)!;
    const beforeHead = snake.current.positions.at(-2);

    if (
      beforeHead &&
      isSamePosition(beforeHead, {
        x: handleOutOfBounds(head.x + x, width),
        y: handleOutOfBounds(head.y + y, height),
      })
    ) {
      return;
    }

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
      if (!show || isGameOver) return;

      let isSnakeDead = false;

      const newGrid = createGrid(width, height);

      // Update snake position
      const v = vel.current[0];

      const nextCell = {
        x: handleOutOfBounds(snake.current.positions.at(-1)!.x + v.x, width),
        y: handleOutOfBounds(snake.current.positions.at(-1)!.y + v.y, height),
      };

      if (vel.current.length > 1) {
        vel.current.splice(0, 1);
      }

      // Check if apple is touched
      if (apple.current && isSamePosition(nextCell, apple.current)) {
        apple.current = null;
        snake.current.length++;
        player.play("score");
      }

      // Check if snake touched it self
      if (
        getSnakePositions(snake.current).some((cell) =>
          isSamePosition(cell, nextCell)
        )
      ) {
        setIsGameOver(true);
        setIsWin(false);
        isSnakeDead = true;
        player.play("lose");
      }

      snake.current.positions = [...snake.current.positions, nextCell];

      if (snake.current.positions.length > width * height) {
        snake.current.positions = snake.current.positions.slice(
          snake.current.positions.length - width * height
        );
      }

      // Calculate new apple position
      if (
        !apple.current ||
        (ticksCount.current % Math.max(width, height)) * 2 === 0
      ) {
        const occupiedCells = getSnakePositions(snake.current);
        const emptyPositions = getEmptyPositions(width, height, occupiedCells);

        if (!emptyPositions.length) {
          setIsGameOver(true);
          setIsWin(true);
          player.play("win");
          return;
        }

        const getRandomPosition = () =>
          emptyPositions[Math.round(Math.random() * emptyPositions.length)];

        apple.current = getRandomPosition();
      }

      // draw snake on screen
      getSnakePositions(snake.current).forEach((cell) => {
        newGrid[cell.y][cell.x] = CELL.snake;
      });

      // draw apple on screen
      if (apple.current) newGrid[apple.current.y][apple.current.x] = CELL.apple;

      // draw intersection
      if (isSnakeDead) {
        const head = snake.current.positions.at(-1)!;
        newGrid[head.y][head.x] = CELL.dead;
      }

      setGrid(newGrid);

      ticksCount.current++;
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
  }, [show, isGameOver]);

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
                  cell === CELL.empty && "bg-white/20",
                  cell === CELL.snake && "bg-white",
                  cell === CELL.apple && "bg-yellow-400",
                  cell === CELL.dead && "bg-red-400"
                )}
                key={`${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center text-2xl">
        <IconButton icon={<ArrowUp />} onClick={setVelUp} />
        <div className="flex gap-10">
          <IconButton
            icon={<ArrowUp className="-rotate-90" />}
            onClick={setVelLeft}
          />
          <IconButton
            icon={<ArrowUp className="rotate-90" />}
            onClick={setVelRight}
          />
        </div>
        <IconButton
          icon={<ArrowUp className="rotate-180" />}
          onClick={setVelDown}
        />
      </div>

      {show && (
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center gap-8 transition-all duration-500",
            isGameOver
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <h2
            className={cn(
              "text-6xl",
              isWin ? "text-green-400" : "text-red-400"
            )}
          >
            {isWin ? "YOU WON!" : "GAME OVER!"}
          </h2>
          <Button label="Play again" onClick={resetGame} />
        </div>
      )}
    </div>
  );
}
