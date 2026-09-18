import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, ScanSearch, Users } from "lucide-react";

const TalentScene = lazy(() => import("./talent-scene"));

export function AuthArtwork() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section
      className="auth-artwork"
      aria-label="Connected career pathways illustration"
    >
      <div className="auth-grid" aria-hidden="true" />
      <div className="relative z-10">
        <div className="auth-eyebrow">
          <span /> PEOPLE FIRST. POSSIBILITY NEXT.
        </div>
        <h1 className="auth-headline">
          Great people.
          <br />
          Even greater
          <br />
          <span>possibilities.</span>
        </h1>
        <p className="auth-story">
          See the signals. Unlock potential.
          <br />
          Give your best people a reason to stay.
        </p>
      </div>
      <div className="talent-stage">
        <svg
          className="talent-fallback"
          viewBox="0 0 480 420"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="talent-path"
              x1="120"
              y1="360"
              x2="330"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--scene-blue))" />
              <stop offset="1" stopColor="hsl(var(--scene-mint))" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 22 - 22},0)`}>
              <path
                d="M180 365 C410 290 40 190 280 55"
                stroke="url(#talent-path)"
                strokeWidth={i === 1 ? 3 : 1}
                opacity={i === 1 ? 0.7 : 0.3}
              />
              <circle cx="180" cy="365" r="7" fill="hsl(var(--scene-blue))" />
              <circle cx="280" cy="55" r="9" fill="hsl(var(--scene-mint))" />
            </g>
          ))}
        </svg>
        {ready && (
          <Suspense fallback={null}>
            <TalentScene />
          </Suspense>
        )}
        <div className="talent-label talent-label-signal">
          <span className="talent-label-icon">
            <ScanSearch size={16} />
          </span>
          <span>
            <small>UNDERSTAND</small>Workforce signals
          </span>
        </div>
        <div className="talent-label talent-label-growth">
          <span className="talent-label-icon">
            <GitBranch size={16} />
          </span>
          <span>
            <small>UNLOCK</small>Career pathways
          </span>
          <ArrowUpRight size={15} />
        </div>
        <div className="talent-caption">
          <span className="talent-caption-line" /> CONNECTED PEOPLE. SHARED
          GROWTH.
        </div>
      </div>
      <div className="auth-art-footer">
        <Users size={17} />
        <p>
          Intelligence that starts with people.
          <br />
          <span>Decisions that stay human.</span>
        </p>
      </div>
    </section>
  );
}
