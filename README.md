# 漢字 Kanji Lab

Juego de aprendizaje de kanjis por niveles **JLPT (N5 → N1)** con mecánicas de
**arrastrar y soltar**. Los datos vienen de la API pública
[kanjiapi.dev](https://kanjiapi.dev/#!/documentation) y la interfaz está en
español, con tipografía japonesa para los caracteres.

---

## Qué hace

1. Eliges nivel (N5…N1) y, si quieres, filtras por **grado escolar** y por
   **Jōyō** (los filtros que expone la propia API).
2. La app descarga el pool de kanjis de ese nivel y reparte **al azar** un
   kanji entre las cartas del mazo.
3. El enunciado te pide un carácter y **tienes que arrastrar la carta correcta**
   a la zona de respuesta (también funciona con un clic, para teclado y móvil).
4. Si te atascas, abres la **tarjeta de pistas**: cada pista cuesta puntos, así
   que decides si te compensa arriesgar puntuación a cambio de información.
5. Respondas bien o mal, se abre la **ficha completa del kanji** y la lista de
   **kanjis emparentados**, que puedes consultar en una ventana aparte.

### Tipos de reto

| Reto | Enunciado | Se desbloquea en |
|---|---|---|
| `Significado → Kanji` | «Arrastra el kanji que significa *agua*» | N5 |
| `Kanji → Significado` | «Arrastra el significado de 水» | N5 |
| `Lectura → Kanji` | «Arrastra el kanji que se lee *スイ*» | N4 |
| `Kanji emparentado` | «Arrastra el kanji que también se lee *コウ* que 海» | N3 |
| `Palabra compuesta` | «Arrastra el significado de 山 + 川» | N2 |

El mazo y los distractores se eligen al azar en cada ronda, pero se filtran
para que **nunca haya dos respuestas posibles** (un distractor nunca comparte
significado ni lectura con la respuesta correcta).

---

## Tarjeta de pistas

Cada pista cuesta 20 puntos y se van revelando de menos a más:

1. **Estructura** — radical de Kangxi y número de trazos.
2. **Aparece en** — palabras frecuentes que contienen ese kanji, con lectura.
3. **Lectura** — la lectura on en kana y su romaji.
4. **Origen** — la etimología del carácter.

Las pistas que revelarían la respuesta (la lectura en un reto de lectura, el
significado en un reto de significado) se ocultan automáticamente.

---

## Fuentes de datos

| Fuente | Uso | CORS |
|---|---|---|
| [kanjiapi.dev](https://kanjiapi.dev/#!/documentation) | Kanjis, lecturas, grados, JLPT, frecuencias | Sí |
| [Wiktionary ES](https://es.wiktionary.org/) | Palabras que contienen el kanji, con lectura y significado en español | Sí (`origin=*`) |
| [Wiktionary JA](https://ja.wiktionary.org/) | Etimología del carácter (字源) | Sí (`origin=*`) |
| KANJIDIC2 | Tabla local de radicantes (generada en build, sin red) | — |

Las pistas se montan con **datos locales primero** (radical, trazos, lectura y
significado español) y las APIs solo añaden el enriquecimiento, así que la
tarjeta funciona aunque Wiktionary no responda o limite las peticiones.

---

## Arquitectura

```
src/
├─ app/                    # Proveedores y rutas
│  ├─ App.tsx              # Router (react-router)
│  └─ AppProviders.tsx     # ThemeProvider + CssBaseline de MUI
├─ components/
│  ├─ common/              # Piezas reutilizables
│  │  ├─ KanjiGlyph.tsx    # Render de kanjis con tipografía japonesa
│  │  ├─ MexicoFlag.tsx    # Bandera (favicon + insignia)
│  │  ├─ SectionCard.tsx   # Tarjeta con borde fino
│  │  └─ StateBlock.tsx    # Estados carga / error / vacío
│  ├─ game/                # Componentes del juego
│  │  ├─ GameBoard.tsx     # DndContext + layout del tablero
│  │  ├─ DraggableCard.tsx # Carta arrastrable (@dnd-kit/core)
│  │  ├─ KanjiDeck.tsx     # Mazo
│  │  ├─ AnswerSlot.tsx    # Zona de respuesta (droppable)
│  │  ├─ ChallengePrompt.tsx
│  │  ├─ FeedbackPanel.tsx # Resultado de la ronda
│  │  ├─ HintCard.tsx      # Tarjeta de pistas
│  │  ├─ KanjiFicha.tsx    # Ficha reutilizable de un kanji
│  │  ├─ KanjiInfoPanel.tsx
│  │  ├─ KanjiDetailDialog.tsx
│  │  ├─ RelatedKanjiList.tsx
│  │  ├─ LevelSelector.tsx
│  │  ├─ FilterBar.tsx
│  │  └─ Scoreboard.tsx
│  └─ layout/
│     └─ AppShell.tsx      # Barra superior + insignia
├─ data/
│  ├─ meaningsEs.ts        # Diccionario español (762 kanjis + 678 palabras)
│  ├─ compounds.ts         # 115 palabras compuestas de dos kanjis
│  └─ radicals.ts          # Radicales Kangxi de los 2 139 kanjis Jōyō
├─ features/game/          # Toda la lógica del juego, aislada de la UI
│  ├─ types.ts             # ChallengeKind, GameCard, Challenge, GameFilters
│  ├─ levels.ts            # Configuración de N5 a N1
│  ├─ roundBuilder.ts      # Construcción de rondas (función pura)
│  ├─ gameReducer.ts       # Máquina de estados (useReducer)
│  ├─ loadPool.ts          # Descarga + filtros de la API
│  └─ useGameSession.ts    # Hook que orquesta todo lo anterior
├─ hooks/
│  └─ useKanjiHints.ts     # Carga perezosa del enriquecimiento
├─ pages/
│  ├─ HomePage.tsx
│  └─ GamePage.tsx
├─ services/
│  ├─ http.ts              # fetch con timeout y errores claros
│  ├─ kanjiApi.ts          # Cliente de kanjiapi.dev (+ caché en memoria)
│  └─ hintsApi.ts          # Enriquecimiento desde Wiktionary (+ cola)
├─ theme/
│  ├─ fonts.ts             # Familias tipográficas
│  └─ theme.ts             # Tema de MUI (createTheme)
├─ types/
│  └─ kanji.ts             # Tipos de la API
└─ utils/
   ├─ random.ts            # Barajado y muestreo con RNG inyectable
   ├─ readings.ts          # Limpieza de lecturas (okurigana)
   ├─ romaji.ts            # Kana → romaji (Hepburn)
   └─ text.ts              # Traducciones, lecturas y similitudes
```

**Reglas de la estructura**

- `features/game/` no importa nada de `components/`: la lógica es agnóstica de
  la UI y se puede testear de forma aislada.
- `roundBuilder.ts` y `gameReducer.ts` son funciones puras: reciben el estado y
  devuelven el siguiente estado, sin efectos ni efectos secundarios.
- Los componentes de `components/game/` reciben datos por props; ninguno accede
  a la API directamente.

---

## API de kanjiapi.dev

Se usan los endpoints documentados en <https://kanjiapi.dev/#!/documentation>:

| Endpoint | Uso |
|---|---|
| `GET /v1/kanji/{list}-enriched` | Pool completo del nivel (ficha de cada kanji) |
| `GET /v1/kanji/{list}` | Filtros: `grade-1`…`grade-6`, `grade-8`, `joyo` |
| `GET /v1/kanji/{character}` | Ficha de un kanji suelto (ventana de detalle) |

> La API **no admite barra final**: `/v1/kanji/jlpt-5/` devuelve 404, la ruta
> correcta es `/v1/kanji/jlpt-5`.

Las listas del JLPT **no son acumulativas** (un kanji de N5 no aparece en la
lista de N4), así que el pool de cada nivel se construye uniendo las listas
necesarias: N4 = `jlpt-5` + `jlpt-4`, N3 = `jlpt-5` + `jlpt-4` + `jlpt-3`, etc.

---

## Sistema visual

Inspirado en el lenguaje de Preply: superficies blancas, **bordes sólidos finos
(1.6 px) en lugar de sombras**, radios de 8 px, mucho aire y tipografía
geométrica.

| Uso | Fuente |
|---|---|
| Kanjis | **Shippori Mincho** (mincho japonesa: trazo tradicional) |
| Texto japonés | **Noto Sans JP** |
| Interfaz | **Figtree** (cuerpo y botones) |
| Títulos | **Platform** (display geométrica) |
| Datos técnicos | **JetBrains Mono** (Unicode, lecturas) |

Todas son libres y se cargan desde Google Fonts. La identidad cromática
mantiene el bermellón de los sellos hanko, en consonancia con la bandera de
México que aparece como favicon y como insignia en la barra superior.

---

## Assets

| Archivo | Uso |
|---|---|
| `public/flag-mx.svg` | Escudo vectorial: favicon del navegador |
| `public/icono.jpg` | La bandera completa (1400×1000, sin bordes) de la esquina superior derecha |
| `make_flag.py` | Genera `public/icono.jpg` con Pillow (misma geometría que el SVG) |

```bash
python make_flag.py   # regenera public/icono.jpg
```

---

## Comandos

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # tsc -b && vite build
npm run preview    # sirve la build de producción
npm run lint       # eslint
```

---

## Notas

- La API no ofrece un endpoint de palabras, por eso `data/compounds.ts` es un
  dataset curado a mano (115 compuestos). Cada entrada lleva su nivel JLPT
  calculado a partir del nivel real de sus kanjis en la API, de forma que un
  compuesto nunca se ofrece en un nivel donde aún no se conocen sus
  caracteres.
- `data/meaningsEs.ts` traduce el 100 % de N5, N4 y N3, y una parte de N2/N1
  mediante un diccionario de respaldo por palabra inglesa.
- `data/radicals.ts` se generó a partir de KANJIDIC2 y se filtró al juego
  Jōyō; el radical clásico es el número 1-214, Traducido al carácter del
  bloque Unicode U+2F00.
- El romaji se calcula en el navegador a partir del kana de la API
  (`utils/romaji.ts`), sin depender de la API.
- Las lecturas se limpian antes de mostrarse: KANJIDIC marca la okurigana con
  un punto (`さ.す`) y el final con un guion (`あま-`), y esos marcadores no
  significan nada para quien está aprendiendo.
