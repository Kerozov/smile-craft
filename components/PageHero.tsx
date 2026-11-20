import type { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

/** Общ светъл „хедър“ за вътрешните страници */
export default function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  children,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-aura absolute inset-0 -z-10" aria-hidden="true" />
      <div className="grid-lines absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div
        className={cn(
          "container-wide px-5 pb-20 pt-[calc(var(--header-offset)+4.5rem)] sm:px-8 md:pb-28 md:pt-[calc(var(--header-offset)+7rem)] lg:px-12",
          align === "center" && "text-center"
        )}
      >
        <ScrollReveal>
          <p className="eyebrow-label">{eyebrow}</p>
          <h1 className={cn("heading-xl mt-6 max-w-5xl", align === "center" && "mx-auto")}>
            {title}
            {accent && (
              <>
                {" "}
                <span className="text-gold-gradient italic">{accent}</span>
              </>
            )}
          </h1>
          {lead && (
            <p className={cn("lead mt-8 max-w-2xl", align === "center" && "mx-auto")}>{lead}</p>
          )}
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}
