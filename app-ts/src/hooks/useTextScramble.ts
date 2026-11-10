import { useState, useEffect } from "react";

const CHARS = "!<>-_\\/[]{}--=+*^?#________";

export function useTextScramble(text: string, isActive: boolean): string {
  const [displayChars, setDisplayChars] = useState<string[]>(
    Array.from({ length: text.length }, () => " ")
  );

  useEffect(() => {
    if (!isActive) {
      setDisplayChars(Array.from({ length: text.length }, () => " "));
      return;
    }

    let currentIndex = 0;

    const interval = setInterval(() => {
      setDisplayChars((prev) => {
        const next = [...prev];
        if (currentIndex < text.length) {
          next[currentIndex] = text[currentIndex];
          currentIndex++;
        }
        for (let i = currentIndex; i < text.length; i++) {
          next[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        return next;
      });

      if (currentIndex >= text.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, text]);

  return displayChars.join("");
}
