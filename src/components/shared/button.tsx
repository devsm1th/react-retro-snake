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

export function IconButton() {}
