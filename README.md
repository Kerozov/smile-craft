# Smile Craft

Сайт на дентална практика Smile Craft — Д-р Ани Овардова (Пловдив, Рудозем, Девин).
Next.js 15 (App Router), Tailwind CSS, Framer Motion, three.js / React Three Fiber.

## Стартиране

```bash
bun install
bun run dev     # http://localhost:3000
bun run build   # продукционен билд + lint + типове
```

## 3D сцени

- `components/three/HeroScene.tsx` — 3D молар в началото (паралакс към курсора и скрола).
- `components/three/ArchScene.tsx` — ортодонтската история: зъбна дъга, която се
  подрежда при скрол (криви зъби → дигитален план → брекети и дъга → равна усмивка).
- `lib/three/toothGeometry.ts` — зъбите се генерират процедурно (SDF + marching cubes),
  без външни 3D файлове.

Сцените се зареждат само в браузъра, спират да рендерират извън екрана, ползват по-ниска
резолюция на телефон и се успокояват при `prefers-reduced-motion`. Без WebGL се показва
2D версията (`components/OrthodonticsSvgStage.tsx`).

## Снимки

- **Д-р Овардова:** сложете снимката в `public/` и попълнете `doctorPhoto` в `lib/utils.ts`.
- **Преди/след:** добавете `beforeImage` и `afterImage` към записите в `lib/results.ts`
  (напр. `"/results/1-before.jpg"`). Докато ги няма, се показва векторна илюстрация с
  надпис „Илюстрация“.

## Форма за час

Няма backend за заявки: формата отваря имейл до избрания кабинет с попълнените данни и
показва телефона на кабинета. При нужда от автоматично изпращане — свържете API route
или услуга за форми в `components/BookingForm.tsx`.
