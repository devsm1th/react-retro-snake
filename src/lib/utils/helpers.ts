import { CELL } from "../constants";

export const handleOutOfBounds = (value: number, max: number) => {
  if (value < 0) return max - 1;
  else if (value > max - 1) return 0;
  return value;
};

export type Vec2 = { x: number; y: number };
export type Snake = {
  positions: Vec2[];
  length: number;
};

export const getSnakePositions = (snake: Snake) => {
  const results: Vec2[] = [];

  for (let i = 1; i <= snake.length; i++) {
    results.push(snake.positions.at(-i)!);
  }

  return results;
};

export const getEmptyPositions = (
  w: number,
  h: number,
  occupiedCells: Vec2[]
) => {
  const emptyCells: Vec2[] = [];

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (!occupiedCells.find((cell) => cell.x === i && cell.y === j)) {
        emptyCells.push({
          x: i,
          y: j,
        });
      }
    }
  }

  return emptyCells;
};

export const isSamePosition = (pos1: Vec2, pos2: Vec2) =>
  pos1.x === pos2.x && pos1.y === pos2.y;

export const createGrid = (w: number, h: number) => {
  const grid: number[][] = [];

  for (let i = 0; i < h; i++) {
    grid.push([]);
    for (let j = 0; j < w; j++) {
      grid[i].push(CELL.empty);
    }
  }

  return grid;
};
