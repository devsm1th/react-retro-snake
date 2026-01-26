import type { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button
      className={cn(
        "text-lg md:text-2xl bg-white/20 px-4 py-2 cursor-pointer hover:brightness-90 active:brightness-100",
        className
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

type IconButton = {
  icon: ReactNode;
  onClick: () => void;
};

export function IconButton({ icon, onClick }: IconButton) {
  return (
    <button
      className="flex items-center justify-center size-10 bg-white/20 cursor-pointer hover:brightness-90 active:brightness-100"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
