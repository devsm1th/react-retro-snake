import { useState } from "react";
import { HomeScreen } from "./components/screens/home";

export default function App() {
  const [isHomePage, setIsHomePage] = useState(true);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-20 overflow-hidden">
      <HomeScreen show={isHomePage} onStart={() => setIsHomePage(false)} />
    </div>
  );
}
