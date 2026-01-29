import { useEffect, useRef } from "react";
import selectSound from "../../assets/sfx/select.mp3";
import scoreSound from "../../assets/sfx/score.mp3";
import loseSound from "../../assets/sfx/lose.mp3";
import winSound from "../../assets/sfx/win.mp3";

const SFX = {
  select: selectSound,
  score: scoreSound,
  lose: loseSound,
  win: winSound,
} as const;

export function useSFX() {
  const sounds = useRef({
    select: new Audio(SFX.select),
    score: new Audio(SFX.score),
    lose: new Audio(SFX.lose),
    win: new Audio(SFX.win),
  });

  const playSound = (sfx: keyof typeof SFX) => {
    const sound = sounds.current[sfx];
    sound.volume = Math.max(Math.random() * 0.5, 0.2);
    sound.playbackRate = 0.8 + Math.random() * 0.4;

    if (!sound.paused) {
      sound.currentTime = 0;
    }

    sound.play();
  };

  useEffect(() => {
    Object.values(sounds.current).forEach((sound) => sound.load());
  }, []);

  return {
    play: playSound,
  };
}
