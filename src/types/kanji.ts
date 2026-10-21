/** Objeto kanji tal y como lo devuelve https://kanjiapi.dev/v1/kanji/{character} */
export interface Kanji {
  /** El propio kanji, p. ej. "水" */
  kanji: string;
  /** Lecturas kun (hiragana) */
  kun_readings: string[];
  /** Lecturas on (katakana) */
  on_readings: string[];
  /** Lecturas usadas únicamente en nombres propios */
  name_readings: string[];
  /** Significados en inglés, el primero es el principal */
  meanings: string[];
  /** Número de trazos */
  stroke_count: number;
  /** Conteos de trazos alternativos registrados en KANJIDIC */
  alternate_stroke_counts: number[];
  /** Código unicode en hexadecimal, p. ej. "6C34" */
  unicode: string;
  /** Grado escolar (1-6, 8, 9) o null */
  grade: number | null;
  /** Palabra clave de Heisig en inglés */
  heisig_en: string;
  /** Nivel JLPT (1-5) o null */
  jlpt: number | null;
  /** Frecuencia en Mainichi Shimbun */
  freq_mainichi_shinbun: number;
  /** Notas adicionales */
  notes: string[];
}

/**
 * Listas disponibles en kanjiapi.dev.
 * @see https://kanjiapi.dev/#!/documentation
 */
export type KanjiListName =
  | 'joyo'
  | 'jouyou'
  | 'jinmeiyo'
  | 'jinmeiyou'
  | 'heisig'
  | 'kyouiku'
  | 'kyoiku'
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6'
  | 'grade-8'
  | 'jlpt-1'
  | 'jlpt-2'
  | 'jlpt-3'
  | 'jlpt-4'
  | 'jlpt-5'
  | 'all';
