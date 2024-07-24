import { useEffect } from 'react'

const useToggleMode = (config) => {
  useEffect(() => {
    const mode = config.mode
    if (!mode) {
      return
    }

    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(mode);
  }, [config.mode]);
}

export default useToggleMode
