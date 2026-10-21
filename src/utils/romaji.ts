/**
 * Conversión kana → romaji (romaji Hepburn simplificado).
 * Permite mostrar la lectura de un kanji de forma legible para hispanohablantes.
 *
 * Ejemplos: 水 → みず (mizu), 電車 → でんしゃ (densha), 今日 → きょう (kyou).
 */

const BASE: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ヴ: 'vu',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
  ゃ: 'ya', ゅ: 'yu', ょ: 'yo', っ: '',
};

/** Digramas: kana pequeña pegada a la base. */
const DIGRAPHS: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  ぢゃ: 'ja', ぢゅ: 'ju', ぢょ: 'jo',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  がゃ: 'gya', がゅ: 'gyu', がょ: 'gyo',
  ざゃ: 'ja', ざゅ: 'ju', ざょ: 'jo',
  だゃ: 'ja', だゅ: 'ju', だょ: 'jo',
  ばゃ: 'bya', ばゅ: 'byu', ばょ: 'byo',
  ぱゃ: 'pya', ぱゅ: 'pyu', ぱょ: 'pyo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo',
  てぃ: 'ti', でぃ: 'di', とぅ: 'tu', どぅ: 'du',
  うぃ: 'wi', うぇ: 'we', うぉ: 'wo',
  くぁ: 'kwa', くぃ: 'kwi', くぇ: 'kwe', くぉ: 'kwo',
  ぐぁ: 'gwa',
  しぇ: 'she', ちぇ: 'che', じぇ: 'je',
  つぁ: 'tsa', つぃ: 'tsi', つぇ: 'tse', つぉ: 'tso',
};

const VOWELS = 'aiueo';

/** Vocales con macron para la vocal larga (chōonpu). */
const LONG_VOWELS: Record<string, string> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };

/** Katakana → hiragana para poder reutilizar las mismas tablas. */
function toHiragana(char: string): string {
  const code = char.charCodeAt(0);
  // ァ(0x30A1) .. ヶ(0x30F6) → ぁ(0x3041) .. ゖ(0x3096)
  if (code >= 0x30a1 && code <= 0x30f6) {
    return String.fromCharCode(code - 0x60);
  }
  return char;
}

/** Romaji de una sílaba (1 o 2 kana) a partir de una posición. */
function readSyllable(kana: string, index: number): string {
  const pair = kana.slice(index, index + 2);
  if (pair.length === 2 && DIGRAPHS[pair]) {
    return DIGRAPHS[pair];
  }
  return BASE[kana[index] ?? ''] ?? '';
}

/** Convierte una lectura kana en romaji. Devuelve la cadena original si no es kana. */
export function toRomaji(reading: string): string {
  const kana = reading
    .split('')
    .map(toHiragana)
    .join('');

  let out = '';
  let i = 0;

  while (i < kana.length) {
    const char = kana[i];

    // Sokuon (っ): duplica la consonante de la sílaba siguiente.
    if (char === 'っ') {
      const next = readSyllable(kana, i + 1);
      if (next && !VOWELS.includes(next[0])) {
        out += next[0];
      }
      i += 1;
      continue;
    }

    // Chōonpu (ー): alarga la vocal anterior.
    if (char === 'ー') {
      const last = out[out.length - 1];
      if (last && VOWELS.includes(last)) {
        out = out.slice(0, -1) + (LONG_VOWELS[last] ?? last);
      }
      i += 1;
      continue;
    }

    // N (ん): añade apóstrofo si le sigue una vocal o "y".
    if (char === 'ん') {
      const next = kana[i + 1];
      if (next && (VOWELS.includes(next) || 'やゆよ'.includes(next))) {
        out += "n'";
      } else {
        out += 'n';
      }
      i += 1;
      continue;
    }

    const pair = kana.slice(i, i + 2);
    if (pair.length === 2 && DIGRAPHS[pair]) {
      out += DIGRAPHS[pair];
      i += 2;
      continue;
    }

    const single = BASE[char];
    if (single !== undefined) {
      out += single;
    }
    i += 1;
  }

  return out.replace(/-+/g, '-').replace(/-$/, '').trim();
}

/** Lectura formateada para la interfaz: «みず (mizu)». */
export function formatReading(reading: string): string {
  const romaji = toRomaji(reading);
  return romaji ? `${reading} (${romaji})` : reading;
}