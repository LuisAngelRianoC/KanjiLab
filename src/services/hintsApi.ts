/**
 * Enriquecimiento de los datos de un kanji para las pistas.
 *
 * Fuente: la API de **MediaWiki** de Wiktionary (es y ja), que admite CORS
 * con el parámetro `origin=*` y por tanto se puede consumir directamente
 * desde el navegador.
 *
 * - **es.wiktionary** (retroenlaces): palabras que contienen el kanji, con su
 *   lectura (kana y romaji) y su significado en español.
 * - **ja.wiktionary** (ficha del kanji): etimología (字源).
 *
 * Es un complemento: el radical, los trazos, la lectura y el significado
 * español seSacoon localmente, así que las pistas funcionan aunque estas
 * fuentes no respondan. Las respuestas se cachean porque Wiktionary limita
 * las peticiones por minuto.
 */

const ES_API = 'https://es.wiktionary.org/w/api.php';
const JA_API = 'https://ja.wiktionary.org/w/api.php';

/** Una palabra que contiene el kanji. */
export interface HintWord {
  /** La palabra, p. ej. "海水". */
  word: string;
  /** Lectura en hiragana, p. ej. "かいすい". */
  reading: string;
  /** Romaji, p. ej. "kaisui". */
  romaji: string;
  /** Significado en español, p. ej. "agua de mar". */
  meaning: string;
}

/** Datos de apoyo que aportan las fuentes externas. */
export interface KanjiEnrichment {
  words: HintWord[];
  etymology: string | null;
}

const EMPTY: KanjiEnrichment = { words: [], etymology: null };

/**
 * Cola de peticiones: Wikimedia limita las peticiones por minuto y por
 * usuario, así que las serializamos con un intervalo mínimo entre llamadas.
 */
let queue: Promise<unknown> = Promise.resolve();
const MIN_INTERVAL_MS = 350;

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(async () => {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS));
    return task();
  });
  // La cola nunca debe romperse por un fallo puntual.
  queue = result.catch(() => undefined);
  return result;
}

/** `fetch` con timeout y CORS. */
async function fetchJson<T>(url: string, timeoutMs = 9000): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Quita las marcas de wiki y deja texto legible. */
function cleanWikiText(text: string): string {
  return text
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/<references[^>]*\/>/g, '')
    .replace(/\{\{plm\|([^|}]*)\}\}/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2')
    .replace(/'''?/g, '')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Resumen de la etimología (字源) del Wiktionary japonés. */
function japaneseEtymology(extract: string): string | null {
  const match = extract.match(/==+\s*字源\s*==+([\s\S]*?)(?==+\s|$)/);
  if (!match) return null;

  const text = cleanWikiText(match[1]);
  if (!text) return null;

  // Nos quedamos con las dos primeras frases, que concentran la explicación.
  const sentences = text.split(/(?<=。)/).filter((s) => s.trim().length > 0);
  const summary = sentences.slice(0, 2).join('').trim();
  if (summary.length < 3) return null;

  return summary.length > 220 ? `${summary.slice(0, 217)}…` : summary;
}

interface MediaWikiPage {
  title: string;
  extract?: string;
  revisions?: { slots?: { main?: { content?: string } } }[];
}

interface MediaWikiResponse {
  query?: { pages?: MediaWikiPage[] };
}

/** Lee la lectura y el significado de una entrada de palabra japonesa. */
function parseWordEntry(wikitext: string): {
  reading: string;
  romaji: string;
  meaning: string;
  isJapanese: boolean;
} {
  // La lectura vive en la plantilla {{pron-graf}}: hay que buscarla solo ahí
  // para no confundirla con otras plantillas del mismo artículo.
  const pron = wikitext.match(/\{\{pron-graf([\s\S]*?)\}\}/);
  const body = pron?.[1] ?? '';

  // Según la entrada, el hiragana puede venir en "e1=" o en "ea=".
  const e1 = body.match(/\|(?:e1|ea)=([^|}]+)/);
  const e2 = body.match(/\|e2=([^|}]+)/);

  // ";1: {{plm|lluvia}}." o ";1 {{csem|...}}: {{plm|lluvia}}."
  const definition = wikitext.match(/;\d+\s*:?\s*(.+)/);
  const meaning = definition
    ? cleanWikiText(definition[1]).replace(/^[:\s]+/, '').replace(/[:\s]+$/, '')
    : '';

  // Según la entrada, el hiragana puede venir en "e1=" o en "ea=".
  let reading = e1 ? e1[1].trim() : '';
  let romaji = e2 ? e2[1].trim() : '';

  // Si el campo de romaji trae kana, es en realidad la lectura.
  if (romaji && /[\u3040-\u30ff]/.test(romaji)) {
    reading = reading || romaji;
    romaji = '';
  }

  return {
    reading,
    romaji,
    meaning: meaning.length > 3 ? meaning : '',
    isJapanese: /leng\s*=\s*ja\b/.test(body),
  };
}

/** Palabras del Wiktionary español que contienen el kanji. */
async function fetchWords(kanji: string): Promise<HintWord[]> {
  const url =
    `${ES_API}?origin=*&action=query&generator=backlinks&gbltitle=${encodeURIComponent(kanji)}` +
    '&gblnamespace=0&gbllimit=30&prop=revisions&rvprop=content&rvslots=main' +
    '&format=json&formatversion=2&redirects=1';

  const json = await fetchJson<MediaWikiResponse>(url);
  const pages = json?.query?.pages ?? [];

  // El mismo término aparece con varias grafías (kanji, hiragana, romaji):
  // los agrupamos por significado y nos quedamos con la forma en kanji.
  const groups = new Map<string, HintWord[]>();

  for (const page of pages) {
    const wikitext = page.revisions?.[0]?.slots?.main?.content;
    if (!wikitext) continue;

    const parsed = parseWordEntry(wikitext);
    if (!parsed.meaning) continue;

    // Solo interesan las entradas japonesas: las páginas que enlazan con el
    // kanji incluyen también traducciones al español ("agua" -> 水).
    if (!parsed.isJapanese && !/[\u4e00-\u9fff]/.test(page.title)) continue;

    const key = parsed.meaning.toLowerCase();
    const list = groups.get(key) ?? [];
    list.push({ word: page.title, ...parsed });
    groups.set(key, list);
  }

  const words: HintWord[] = [];

  for (const list of groups.values()) {
    const kanjiForm = list.find((w) => /[\u4e00-\u9fff]/.test(w.word));
    const kanaForm = list.find((w) => /[\u3040-\u30ff]/.test(w.word));
    const romajiForm = list.find((w) => /^[a-z]+$/i.test(w.word));

    const best = kanjiForm ?? kanaForm ?? romajiForm ?? list[0];
    const source = kanjiForm ?? kanaForm ?? list[0];

    words.push({
      word: best.word,
      reading: source.reading || (kanaForm ? kanaForm.word : ''),
      romaji: source.romaji || (romajiForm ? romajiForm.word : ''),
      meaning: best.meaning,
    });
  }

  return words.slice(0, 8);
}

/** Etimología en el Wiktionary japonés. */
async function fetchEtymology(kanji: string): Promise<string | null> {
  const url =
    `${JA_API}?origin=*&action=query&prop=extracts&explaintext=1&format=json` +
    `&formatversion=2&redirects=1&titles=${encodeURIComponent(kanji)}`;

  const json = await fetchJson<MediaWikiResponse>(url);
  const extract = json?.query?.pages?.[0]?.extract;
  if (!extract) return null;

  return japaneseEtymology(extract);
}

const cache = new Map<string, KanjiEnrichment>();
const pending = new Map<string, Promise<KanjiEnrichment>>();

/**
 * Descarga los datos de apoyo externos de un kanji.
 * Nunca lanza: si las APIs fallan se devuelve un objeto vacío.
 */
export function fetchKanjiEnrichment(kanji: string): Promise<KanjiEnrichment> {
  const cached = cache.get(kanji);
  if (cached) return Promise.resolve(cached);

  const inFlight = pending.get(kanji);
  if (inFlight) return inFlight;

  const request = (async () => {
    // Las palabras son la pista más útil; la etimología es un extra.
    const words = await enqueue(() => fetchWords(kanji));
    const etymology = await enqueue(() => fetchEtymology(kanji));

    const enrichment: KanjiEnrichment = { words, etymology };

    // Solo cacheamos si obtuvimos algo: si Wikimedia nos limitó, la próxima
    // ronda podrá reintentarlo.
    if (words.length > 0 || etymology) {
      cache.set(kanji, enrichment);
    }
    pending.delete(kanji);
    return enrichment;
  })().catch(() => {
    pending.delete(kanji);
    return EMPTY;
  });

  pending.set(kanji, request);
  return request;
}
