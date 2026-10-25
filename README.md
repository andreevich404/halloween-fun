# Тыквенная лихорадка

Интерактивный одностраничный сайт к Хэллоуину: ночное небо с летучими мышами, мини-игра «Ловец призраков»,
тыква-гадалка с предсказаниями про сессию и дедлайны и конструктор светящейся тыквы.

Вся графика (призраки, летучие мыши, тыквы, луна, паук, кладбище) нарисована вручную в виде inline-SVG и CSS.
Внешних картинок и звуковых файлов нет.

## Стек

- Vue 3 (Composition API, `<script setup>`) + TypeScript (strict)
- Vite
- Tailwind CSS 4 (`@tailwindcss/vite`)
- [motion-v](https://motion.dev/docs/vue) (Vue-порт Framer Motion) для анимаций
- @vueuse/core
- Шрифты Google Fonts с кириллицей: Rubik Wet Paint (заголовки) и Onest (текст)

## Запуск

```bash
npm install
npm run dev      # режим разработки
npm run build    # проверка типов (vue-tsc) и production-сборка в dist/
npm run preview  # локальный просмотр сборки
```

## Деплой на GitHub Pages

В `vite.config.ts` задан `base: './'`, поэтому сборка работает из любого подкаталога.
Workflow `.github/workflows/deploy.yml` собирает проект и публикует `dist` при пуше в `main`
(или вручную через «Run workflow»). В настройках репозитория: Settings → Pages → Source: **GitHub Actions**.

## Структура

```
src/
  components/   HeroSection, SpookySky, BatsLayer, BatSvg, GhostGame, Ghost, GhostArt, BurstFx,
                PumpkinOracle, PumpkinBuilder, PumpkinSvg, SegmentedControl, PartIcon,
                SiteHeader, SiteFooter, SpiderDangler, SpringButton, SectionTitle
  composables/  useGame, useLocalStorage, useSound, useActiveSection
  data/         predictions.ts (37 предсказаний), pumpkinParts.ts (глаза, носы, рты, свечи)
  types/        общие типы
```

## Игра

30 секунд. Обычные призраки дают +1, фиолетовые +2, редкий золотой +5. Зелёная тыква-ловушка отнимает 3 очка и
2 секунды. Лучший результат хранится в `localStorage` (с защитой от ошибок хранилища). Работает мышью и пальцем
(pointer events). Звук (Web Audio, осцилляторы) по умолчанию выключен, включается кнопкой в панели игры.

## Анимации motion-v

| Где | Что |
| --- | --- |
| Заголовок hero | stagger-появление букв (spring), мерцание отдельных букв (keyframes `opacity` с `repeatDelay`) |
| Небо | мерцание звёзд (keyframes), парящая луна, дрейф облаков, мигающие окна дома |
| Летучие мыши | случайные траектории (`x`/`y`/`rotate` keyframes в `vw`/`vh`), перегенерация по `animation-complete`, взмахи крыльев (`rotate`/`scaleY` keyframes на SVG-группах) |
| Параллакс | движение мыши: `useMotionValue` + `useSpring` + `useTransform`; скролл: `useScroll` + `useTransform` |
| Секции | `whileInView` с variants и `staggerChildren`, spring-появление карточек |
| Кнопки | `whileHover` и `whilePress` с пружиной (`SpringButton`) |
| Drag | паучок на нитке (`drag="y"`, `dragConstraints`, `dragElastic`, `dragSnapToOrigin`, `whileDrag`); конфеты, которые можно скормить тыкве |
| Игра | spring-появление призраков, drift-траектории (keyframes), `AnimatePresence` с exit, взрыв частиц и всплывающие очки, тряска поля через `animate()`, bump счёта |
| Гадалка | дрожь тыквы (keyframes `rotate`/`scale`), вспышка глаз, 3D flip-карточка (`rotateY` + spring), парящий знак вопроса |
| Конструктор | сегментированные контролы с `layoutId`-индикатором, переключатель света с `layout`, мерцание свечи, пружинное появление частей лица, галерея с `layout` и `AnimatePresence mode="popLayout"` |
| Навигация | `layoutId="nav-pill"` для подсветки активной секции (IntersectionObserver) |

## Доступность

- `prefers-reduced-motion`: `MotionConfig reduced-motion="user"` и `useReducedMotion()` отключают зацикленные
  анимации (мыши, звёзды, парение, мерцание, дрейф призраков). Игра остаётся рабочей.
- Интерактивные элементы доступны с клавиатуры, у иконок и кнопок есть `aria-label`, у контролов роли `radiogroup`/`switch`.
