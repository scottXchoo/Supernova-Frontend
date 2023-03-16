import { useState, useEffect } from "react";
export const LG_WINDOW_SIZE = 1080;
export const MD_WINDOW_SIZE = 768;
export interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
}

export const useWindowSize = (maxMobileWidth: number): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= maxMobileWidth,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [maxMobileWidth]);

  return windowSize;
};
