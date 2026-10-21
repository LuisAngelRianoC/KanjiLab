/**
 * Tipografías del proyecto.
 *
 * - `jp`      → trazos de kanji (Shippori Mincho: mincho japonesa, libre en Google Fonts)
 * - `jpSans`  → japanese UI/labels (Noto Sans JP)
 * - `body`    → interfaz latina (Figtree: geométrica y muy legible)
 * - `display` → títulos (Platform: display geométrica de la familia Preply)
 * - `mono`    → datos técnicos (unicode, lecturas) (JetBrains Mono)
 */
export const fonts = {
  body: '"Figtree", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  display: '"Platform", "Figtree", "Outfit", system-ui, sans-serif',
  jp: '"Shippori Mincho", "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
  jpSans: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

/** Familias que la app descarga (se inyectan en index.html). */
export const FONT_HREF =
  'https://fonts.googleapis.com/css2?' +
  'family=Figtree:wght@400;500;600;700;800' +
  '&family=Platform:wght@400;500;600;700' +
  '&family=Shippori+Mincho:wght@400;500;600;700' +
  '&family=Noto+Sans+JP:wght@400;500;700' +
  '&family=JetBrains+Mono:wght@400;500&display=swap';
