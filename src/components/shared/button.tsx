import type { ReactNode } from "react";

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      className="text-lg md:text-2xl bg-white/20 px-4 py-2 cursor-pointer hover:brightness-90 active:brightness-100"
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
