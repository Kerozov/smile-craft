"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { locationList } from "@/lib/locations";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import type { LocationSlug } from "@/lib/utils";

interface BookingFormProps {
  className?: string;
}

const gradMap: Record<string, LocationSlug> = {
  plovdiv: "plovdiv",
  rudozem: "rudozem",
  devin: "devin",
};

export default function BookingForm({ className }: BookingFormProps) {
  const searchParams = useSearchParams();
  const gradParam = searchParams.get("grad") ?? "";
  const defaultLocation = gradMap[gradParam] ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-sm border border-accent-gold/30 bg-bg-dark/80 p-10 text-center",
          className
        )}
      >
        <p className="font-display text-2xl font-medium text-text-light">
          Благодарим ви!
        </p>
        <p className="mt-4 font-body text-text-light/70">
          Получихме заявката ви. Екипът на Smile Craft ще се свърже с вас в
          рамките на един работен ден.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
      aria-label="Форма за записване на час"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
            Име и фамилия *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light placeholder:text-text-light/30 focus:border-accent-gold focus:outline-none"
            placeholder="Вашето име"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
            Телефон *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light placeholder:text-text-light/30 focus:border-accent-gold focus:outline-none"
            placeholder="+359 ..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
          Имейл
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light placeholder:text-text-light/30 focus:border-accent-gold focus:outline-none"
          placeholder="email@example.com"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
            Локация *
          </label>
          <select
            id="location"
            name="location"
            required
            defaultValue={defaultLocation}
            className="w-full rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light focus:border-accent-gold focus:outline-none"
          >
            <option value="" disabled>
              Изберете ателие
            </option>
            {locationList.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.nameBg}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="service" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
            Услуга
          </label>
          <select
            id="service"
            name="service"
            className="w-full rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light focus:border-accent-gold focus:outline-none"
          >
            <option value="">Изберете услуга</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="date" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
          Предпочитана дата
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light focus:border-accent-gold focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-light/60">
          Съобщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full resize-none rounded-sm border border-white/10 bg-bg-dark/50 px-4 py-3 font-body text-text-light placeholder:text-text-light/30 focus:border-accent-gold focus:outline-none"
          placeholder="Споделете ни повече за вашите нужди..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-accent-gold px-8 py-4 font-body text-sm font-medium text-bg-dark transition-colors hover:bg-accent-gold/90 disabled:opacity-60 md:w-auto"
      >
        {loading ? "Изпращане..." : "Изпрати заявка"}
      </button>
    </form>
  );
}
