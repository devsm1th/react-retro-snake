import { cn } from "../../lib/utils/cn";
import { Button } from "../shared/button";

type HomeScreenProps = {
  show: boolean;
  onStart: () => void;
};

export function HomeScreen({ show, onStart }: HomeScreenProps) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-20 overflow-hidden fixed top-0 left-0">
      <h1
        className={cn(
          "text-4xl md:text-6xl text-center transition-all duration-1000",
          !show && "translate-y-[-50vh] opacity-0 pointer-events-none"
        )}
      >
        Snake Game
      </h1>

      <div
        className={cn(
          "flex flex-col gap-4 transition-all duration-1000",
          !show && "translate-y-[50vh] opacity-0 pointer-events-none"
        )}
      >
        <Button label="START" onClick={onStart} />
      </div>
    </div>
  );
}
