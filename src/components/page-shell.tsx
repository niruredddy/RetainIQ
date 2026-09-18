<<<<<<< HEAD
import { motion } from "framer-motion";
=======
>>>>>>> origin/enter-main
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("mx-auto w-full max-w-[1440px] px-5 py-6 lg:px-8", className)}
    >
      {children}
    </motion.div>
=======
    <div
      className={cn(
        "page-enter mx-auto w-full max-w-[1440px] px-5 py-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
>>>>>>> origin/enter-main
  );
}

export function PageHeader({
  title,
  description,
  right,
}: {
  title: string;
  description: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}
