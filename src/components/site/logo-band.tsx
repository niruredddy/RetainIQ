import { Reveal } from "./reveal";

const NAMES = [
  "VERIDIA",
  "ORIZON",
  "HELIXSTONE",
  "NAVA LABS",
  "CORELIGHT",
  "ASTERWIND",
];

export function LogoBand() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
        <Reveal>
          <p className="text-center font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
            TRUSTED BY TEAMS THAT SHIP
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {NAMES.map((name) => (
              <span
                key={name}
                className="font-mono text-xs tracking-[0.18em] text-muted-foreground/70 transition-colors duration-200 hover:text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
