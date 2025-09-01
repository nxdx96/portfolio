import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
  children, 
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  disableTransitionOnChange = false,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={disableTransitionOnChange}
      forcedTheme="dark"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}