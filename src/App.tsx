import { useState } from "react";
import { HomeScreen } from "./components/screens/home";
import { GameScreen } from "./components/screens/game";
import { useSFX } from "./lib/hooks/use-sfx";

export default function App() {
  const [isHomePage, setIsHomePage] = useState(true);
  const player = useSFX();

  return (
    <div>
      <HomeScreen
        show={isHomePage}
        onStart={() => {
          setIsHomePage(false);
          player.play("select");
        }}
      />
      <GameScreen show={!isHomePage} />
    </div>
  );
}
