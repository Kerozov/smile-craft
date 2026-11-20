"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
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
  "w-full rounded-2xl border border-ink/[0.08] bg-white/90 px-5 py-4 font-body text-[15px] text-ink shadow-inner-light transition-[border-color,box-shadow] duration-300 placeholder:text-ink-muted/60 focus:border-gold/60 focus:outline-none focus:ring-4 focus:ring-gold-light/40";

const labelClass =
  "mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted";

export default function BookingForm({ className }: BookingFormProps) {
  const searchParams = useSearchParams();
  const gradParam = searchParams.get("grad") ?? "";
  const serviceParam = searchParams.get("service") ?? "";
  const defaultLocation = gradMap[gradParam] ?? "";
  const defaultService = services.some((s) => s.id === serviceParam)
    ? serviceParam
    : "";

  const [sent, setSent] = useState<null | { email: string; phone: string; city: string }>(null);
  const [today, setToday] = useState<string>();

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  /**
   * Няма backend за заявки, затова досега формата само показваше „Благодарим“
   * и заявката се губеше. Сега се отваря имейл до избрания кабинет с всички
   * попълнени данни, а пациентът вижда и телефона за директна връзка.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const loc = locationList.find((l) => l.slug === data.get("location")) ?? locationList[0];
    const service = services.find((s) => s.id === data.get("service"));

    const lines = [
      `Име: ${data.get("name")}`,
      `Телефон: ${data.get("phone")}`,
      data.get("email") ? `Имейл: ${data.get("email")}` : "",
      `Кабинет: ${loc.nameBg}`,
      service ? `Услуга: ${service.title}` : "",
      data.get("date") ? `Предпочитана дата: ${data.get("date")}` : "",
      data.get("message") ? `\nСъобщение:\n${data.get("message")}` : "",
    ].filter(Boolean);

    const subject = `Заявка за час — ${loc.nameBg}`;
    window.location.href = `mailto:${loc.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent({ email: loc.email, phone: loc.phone, city: loc.nameBg });
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn("py-6 text-center", className)}
        role="status"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold text-white shadow-glow">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-8 font-display text-3xl text-ink">Почти готово!</p>
        <p className="mx-auto mt-4 max-w-sm font-body text-ink-soft">
          Отворихме имейл до кабинета в {sent.city} с вашата заявка — натиснете
          „Изпрати“ в пощата си. Ако имейлът не се отвори, обадете ни се:
        </p>
        <a href={`tel:${sent.phone.replace(/\s/g, "")}`} className="btn-primary mt-8">
          <Phone className="h-4 w-4" aria-hidden="true" />
          {sent.phone}
        </a>
        <button
          type="button"
          onClick={() => setSent(null)}
          className="mt-6 block w-full font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted hover:text-gold-deep"
        >
          Назад към формата
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-5", className)}
      aria-label="Форма за записване на час"
    >
      <div className="grid gap-5 md:grid-cols-2">
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

      <div className="grid gap-5 md:grid-cols-2">
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
        <input id="date" name="date" type="date" min={today} className={inputClass} />
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

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-xs text-ink-muted">* задължителни полета</p>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Изпрати заявка
        </button>
      </div>
    </form>
  );
}
