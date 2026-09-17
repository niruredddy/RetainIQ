import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";

function useTypewriter(text: string, speed = 90, startDelay = 200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            if (interval) clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);
  return count;
}

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const count = useTypewriter("RetainIQ");
  const brand = "RetainIQ";
  const typedText = brand.slice(0, count);
  const complete = typedText === brand;

  const [showSubtitle, setShowSubtitle] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSubtitle(true), 1100);
    const t2 = setTimeout(() => {
      if (!fired.current) {
        fired.current = true;
        onDone();
      }
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0, y: -28, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-glow-primary"
      >
        <Radar className="h-8 w-8 text-primary" strokeWidth={1.75} />
      </motion.div>

      <h1 className="font-sans text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
        <span>{typedText.slice(0, 6)}</span>
        <span className="text-primary">{typedText.slice(6)}</span>
        {!complete && <span className="ml-0.5 animate-blink text-primary">|</span>}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: showSubtitle ? 1 : 0, y: showSubtitle ? 0 : 6 }}
        transition={{ duration: 0.5 }}
        className="mt-4 font-mono text-sm tracking-[0.2em] text-muted-foreground"
      >
        AUTONOMOUS WORKFORCE MOBILITY &amp; RETENTION ENGINE
      </motion.p>

      <div className="mt-14 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-primary/60"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
