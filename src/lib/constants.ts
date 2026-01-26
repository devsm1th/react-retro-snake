export const KEYS = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
} as const;

export const CELL = {
  empty: 0,
  snake: 1,
  apple: 2,
  dead: 3,
} as const;
