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

const inputClass =
  "w-full rounded-lg border border-beige-pale bg-bg-white px-4 py-3 font-body text-text-dark placeholder:text-text-muted/50 focus:border-beige-primary focus:outline-none focus:ring-1 focus:ring-beige-primary/30";

const labelClass =
  "mb-2 block font-body text-xs font-medium uppercase tracking-wider text-text-muted";

export default function BookingForm({ className }: BookingFormProps) {
  const searchParams = useSearchParams();
  const gradParam = searchParams.get("grad") ?? "";
  const serviceParam = searchParams.get("service") ?? "";
  const defaultLocation = gradMap[gradParam] ?? "";
  const defaultService = services.some((s) => s.id === serviceParam)
    ? serviceParam
    : "";

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
          "rounded-xl border border-beige-pale bg-bg-white p-10 text-center shadow-soft",
          className
        )}
      >
        <p className="font-display text-2xl font-normal text-text-dark">
          Благодарим ви!
        </p>
        <p className="mt-4 font-body text-text-muted">
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
          <label htmlFor="name" className={labelClass}>
            Име и фамилия *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Вашето име"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Телефон *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            placeholder="+359 ..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Имейл
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          placeholder="email@example.com"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="location" className={labelClass}>
            Локация *
          </label>
          <select
            id="location"
            name="location"
            required
            defaultValue={defaultLocation}
            className={inputClass}
          >
            <option value="" disabled>
              Изберете кабинет
            </option>
            {locationList.map((loc) => (
              <option key={loc.slug} value={loc.slug}>
                {loc.nameBg}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="service" className={labelClass}>
            Услуга
          </label>
          <select id="service" name="service" defaultValue={defaultService} className={inputClass}>
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
        <label htmlFor="date" className={labelClass}>
          Предпочитана дата
        </label>
        <input id="date" name="date" type="date" className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Съобщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={cn(inputClass, "resize-none")}
          placeholder="Споделете ни повече за вашите нужди..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60 md:w-auto"
      >
        {loading ? "Изпращане..." : "Изпрати заявка"}
      </button>
    </form>
  );
}
