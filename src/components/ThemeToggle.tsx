import { Moon } from "lucide-react";

const ThemeToggle = () => {
  // Theme toggle disabled - always dark mode
  return (
    <div className="w-9 h-9 rounded-md p-0 flex items-center justify-center">
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    </div>
  );
};

export default ThemeToggle;