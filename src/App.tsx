import { useState } from "react";
import { HomeScreen } from "./components/screens/home";
import { GameScreen } from "./components/screens/game";

export default function App() {
  const [isHomePage, setIsHomePage] = useState(true);

  return (
    <div>
      <HomeScreen show={isHomePage} onStart={() => setIsHomePage(false)} />
      <GameScreen show={!isHomePage} />
    </div>
  );
}
