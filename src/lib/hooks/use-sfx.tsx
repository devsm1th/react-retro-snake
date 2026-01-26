import { useEffect, useRef } from "react";

const SFX = {
  select: "/sfx/select.mp3",
  score: "/sfx/score.mp3",
  lose: "/sfx/lose.mp3",
} as const;

export function useSFX() {
  const sounds = useRef({
    select: new Audio(SFX.select),
    score: new Audio(SFX.score),
    lose: new Audio(SFX.lose),
  });

  const playSound = (sfx: keyof typeof SFX) => {
    const sound = sounds.current[sfx];
    sound.volume = Math.random() * 0.5 + 0.5;
    sound.play();
  };

  useEffect(() => {
    Object.values(sounds.current).forEach((sound) => sound.load());
  }, []);

  return {
    play: playSound,
  };
}
