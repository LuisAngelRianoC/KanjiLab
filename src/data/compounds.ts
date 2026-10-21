/**
 * Palabras compuestas de dos kanjis.
 *
 * La API de kanjiapi.dev no ofrece un endpoint de palabras, así que este
 * dataset está curado a mano. El nivel JLPT de cada compuesto se calcula a
 * partir del nivel real de sus kanjis en la API, de forma que un compuesto
 * nunca se ofrece en un nivel donde todavía no se conocen sus caracteres.
 */
export interface Compound {
  /** Kanjis que forman la palabra, en orden de escritura. */
  chars: string[];
  /** Lectura en hiragana. */
  reading: string;
  /** Romaji de la lectura. */
  romaji: string;
  /** Significado en español. */
  meaningEs: string;
  /** Nivel JLPT del compuesto (1 = más avanzado, 5 = más fácil). */
  jlpt: number;
}

export const COMPOUNDS: Compound[] = [
  { chars: ['大', '人'], reading: 'おとな', romaji: 'otono', meaningEs: 'adulto', jlpt: 5 },
  { chars: ['大', '切'], reading: 'たいせつ', romaji: 'taisetsu', meaningEs: 'importante / precioso', jlpt: 5 },
  { chars: ['大', '事'], reading: 'だいじ', romaji: 'daiji', meaningEs: 'cosa importante', jlpt: 5 },
  { chars: ['日', '本'], reading: 'にほん', romaji: 'nihon', meaningEs: 'Japón', jlpt: 5 },
  { chars: ['電', '車'], reading: 'でんしゃ', romaji: 'densha', meaningEs: 'tren', jlpt: 5 },
  { chars: ['新', '聞'], reading: 'しんぶん', romaji: 'shinbun', meaningEs: 'periódico', jlpt: 5 },
  { chars: ['名', '前'], reading: 'なまえ', romaji: 'namae', meaningEs: 'nombre', jlpt: 5 },
  { chars: ['天', '気'], reading: 'てんき', romaji: 'tenki', meaningEs: 'clima / tiempo', jlpt: 5 },
  { chars: ['午', '前'], reading: 'ごぜん', romaji: 'gozen', meaningEs: 'antes del mediodía', jlpt: 5 },
  { chars: ['午', '後'], reading: 'ごご', romaji: 'gogo', meaningEs: 'tarde', jlpt: 5 },
  { chars: ['今', '日'], reading: 'きょう', romaji: 'kyou', meaningEs: 'hoy', jlpt: 5 },
  { chars: ['明', '日'], reading: 'あした', romaji: 'ashita', meaningEs: 'mañana', jlpt: 5 },
  { chars: ['昨', '日'], reading: 'きのう', romaji: 'kinou', meaningEs: 'ayer', jlpt: 5 },
  { chars: ['今', '年'], reading: 'こんねん', romaji: 'konnen', meaningEs: 'este año', jlpt: 5 },
  { chars: ['来', '年'], reading: 'らいねん', romaji: 'rainen', meaningEs: 'el año próximo', jlpt: 5 },
  { chars: ['英', '語'], reading: 'えいご', romaji: 'eigo', meaningEs: 'inglés', jlpt: 5 },
  { chars: ['外', '国'], reading: 'がいこく', romaji: 'gaikoku', meaningEs: 'extranjero', jlpt: 5 },
  { chars: ['銀', '行'], reading: 'ぎんこう', romaji: 'ginkou', meaningEs: 'banco', jlpt: 5 },
  { chars: ['病', '院'], reading: 'びょういん', romaji: 'byouin', meaningEs: 'hospital', jlpt: 4 },
  { chars: ['医', '者'], reading: 'いしゃ', romaji: 'isha', meaningEs: 'médico', jlpt: 4 },
  { chars: ['会', '社'], reading: 'かいしゃ', romaji: 'kaisha', meaningEs: 'empresa', jlpt: 4 },
  { chars: ['学', '校'], reading: 'がっこう', romaji: 'gakkou', meaningEs: 'escuela', jlpt: 5 },
  { chars: ['先', '生'], reading: 'せんせい', romaji: 'sensei', meaningEs: 'profesor', jlpt: 5 },
  { chars: ['学', '生'], reading: 'がくせい', romaji: 'gakusei', meaningEs: 'estudiante', jlpt: 5 },
  { chars: ['写', '真'], reading: 'しゃしん', romaji: 'shashin', meaningEs: 'fotografía', jlpt: 4 },
  { chars: ['音', '楽'], reading: 'おんがく', romaji: 'ongaku', meaningEs: 'música', jlpt: 4 },
  { chars: ['料', '理'], reading: 'りょうり', romaji: 'ryouri', meaningEs: 'cocina / plato', jlpt: 4 },
  { chars: ['食', '物'], reading: 'たべもの', romaji: 'tabemono', meaningEs: 'comida', jlpt: 5 },
  { chars: ['飲', '物'], reading: 'のみもの', romaji: 'nomimono', meaningEs: 'bebida', jlpt: 4 },
  { chars: ['買', '物'], reading: 'かいもの', romaji: 'kaimono', meaningEs: 'compras', jlpt: 4 },
  { chars: ['旅', '行'], reading: 'りょこう', romaji: 'ryokou', meaningEs: 'viaje', jlpt: 5 },
  { chars: ['家', '族'], reading: 'かぞく', romaji: 'kazoku', meaningEs: 'familia', jlpt: 4 },
  { chars: ['友', '達'], reading: 'ともだち', romaji: 'tomodachi', meaningEs: 'amigo', jlpt: 5 },
  { chars: ['仕', '事'], reading: 'しごと', romaji: 'shigoto', meaningEs: 'trabajo', jlpt: 4 },
  { chars: ['世', '界'], reading: 'せかい', romaji: 'sekai', meaningEs: 'mundo', jlpt: 4 },
  { chars: ['台', '風'], reading: 'たいふう', romaji: 'taifuu', meaningEs: 'tifón', jlpt: 4 },
  { chars: ['火', '山'], reading: 'かざん', romaji: 'kazan', meaningEs: 'volcán', jlpt: 5 },
  { chars: ['山', '川'], reading: 'さんせん', romaji: 'sansen', meaningEs: 'montañas y ríos', jlpt: 5 },
  { chars: ['山', '田'], reading: 'やまだ', romaji: 'yamada', meaningEs: 'campo de montaña', jlpt: 5 },
  { chars: ['高', '山'], reading: 'こうざん', romaji: 'kouzan', meaningEs: 'montaña alta', jlpt: 5 },
  { chars: ['牛', '肉'], reading: 'ぎゅうにく', romaji: 'gyuuniku', meaningEs: 'carne de res', jlpt: 4 },
  { chars: ['工', '業'], reading: 'こうぎょう', romaji: 'kougyou', meaningEs: 'industria', jlpt: 4 },
  { chars: ['作', '業'], reading: 'さぎょう', romaji: 'sagyou', meaningEs: 'trabajo / tarea', jlpt: 4 },
  { chars: ['出', '発'], reading: 'しゅっぱつ', romaji: 'shuppatsu', meaningEs: 'salida / partida', jlpt: 5 },
  { chars: ['入', '口'], reading: 'いりぐち', romaji: 'iriguchi', meaningEs: 'entrada', jlpt: 5 },
  { chars: ['出', '口'], reading: 'しゅつぐち', romaji: 'shutguchi', meaningEs: 'salida', jlpt: 5 },
  { chars: ['毎', '日'], reading: 'まいにち', romaji: 'mainichi', meaningEs: 'todos los días', jlpt: 5 },
  { chars: ['新', '年'], reading: 'しんねん', romaji: 'shinnen', meaningEs: 'año nuevo', jlpt: 5 },
  { chars: ['朝', '日'], reading: 'あさひ', romaji: 'asahi', meaningEs: 'sol de la mañana', jlpt: 5 },
  { chars: ['安', '心'], reading: 'あんしん', romaji: 'anshin', meaningEs: 'tranquilidad', jlpt: 4 },
  { chars: ['電', '気'], reading: 'でんき', romaji: 'denki', meaningEs: 'electricidad', jlpt: 5 },
  { chars: ['電', '話'], reading: 'でんわ', romaji: 'denwa', meaningEs: 'teléfono', jlpt: 5 },
  { chars: ['売', '店'], reading: 'ばいてん', romaji: 'baiten', meaningEs: 'quiosco', jlpt: 4 },
  { chars: ['見', '物'], reading: 'けんぶつ', romaji: 'kenbutsu', meaningEs: 'espectáculo', jlpt: 5 },
  { chars: ['上', '手'], reading: 'じょうず', romaji: 'jouzu', meaningEs: 'hábil', jlpt: 5 },
  { chars: ['下', '手'], reading: 'へた', romaji: 'heta', meaningEs: 'no hábil', jlpt: 5 },
  { chars: ['映', '画'], reading: 'えいが', romaji: 'eiga', meaningEs: 'película', jlpt: 4 },
  { chars: ['地', '図'], reading: 'ちず', romaji: 'chizu', meaningEs: 'mapa', jlpt: 4 },
  { chars: ['手', '紙'], reading: 'てがみ', romaji: 'tegami', meaningEs: 'carta', jlpt: 4 },
  { chars: ['時', '間'], reading: 'じかん', romaji: 'jikan', meaningEs: 'tiempo / hora', jlpt: 5 },
  { chars: ['場', '合'], reading: 'ばあい', romaji: 'baai', meaningEs: 'caso / situación', jlpt: 4 },
  { chars: ['人', '間'], reading: 'にんげん', romaji: 'ningen', meaningEs: 'ser humano', jlpt: 5 },
  { chars: ['社', '会'], reading: 'しゃかい', romaji: 'shakai', meaningEs: 'sociedad', jlpt: 4 },
  { chars: ['集', '会'], reading: 'しゅうかい', romaji: 'shuukai', meaningEs: 'reunión', jlpt: 4 },
  { chars: ['会', '議'], reading: 'かいぎ', romaji: 'kaigi', meaningEs: 'reunión / conferencia', jlpt: 4 },
  { chars: ['安', '全'], reading: 'あんぜん', romaji: 'anzen', meaningEs: 'seguridad', jlpt: 4 },
  { chars: ['不', '便'], reading: 'ふべん', romaji: 'fuben', meaningEs: 'inconveniente', jlpt: 4 },
  { chars: ['便', '利'], reading: 'べんり', romaji: 'benri', meaningEs: 'práctico / conveniente', jlpt: 3 },
  { chars: ['自', '分'], reading: 'じぶん', romaji: 'jibun', meaningEs: 'uno mismo', jlpt: 5 },
  { chars: ['相', '談'], reading: 'そうだん', romaji: 'soudan', meaningEs: 'consulta / charla', jlpt: 3 },
  { chars: ['試', '験'], reading: 'しけん', romaji: 'shiken', meaningEs: 'examen / prueba', jlpt: 4 },
  { chars: ['研', '究'], reading: 'けんきゅう', romaji: 'kenkyuu', meaningEs: 'investigación', jlpt: 4 },
  { chars: ['決', '定'], reading: 'けってい', romaji: 'kettei', meaningEs: 'decisión', jlpt: 3 },
  { chars: ['経', '過'], reading: 'けいか', romaji: 'keika', meaningEs: 'paso del tiempo', jlpt: 3 },
  { chars: ['確', '認'], reading: 'かくにん', romaji: 'kakunin', meaningEs: 'confirmación', jlpt: 3 },
  { chars: ['準', '備'], reading: 'じゅんび', romaji: 'junbi', meaningEs: 'preparación', jlpt: 3 },
  { chars: ['説', '明'], reading: 'せつめい', romaji: 'setsumei', meaningEs: 'explicación', jlpt: 4 },
  { chars: ['提', '案'], reading: 'ていあん', romaji: 'teian', meaningEs: 'propuesta', jlpt: 1 },
  { chars: ['趣', '味'], reading: 'しゅみ', romaji: 'shumi', meaningEs: 'afición', jlpt: 4 },
  { chars: ['習', '慣'], reading: 'しゅうかん', romaji: 'shuukan', meaningEs: 'costumbre', jlpt: 4 },
  { chars: ['文', '化'], reading: 'ぶんか', romaji: 'bunka', meaningEs: 'cultura', jlpt: 4 },
  { chars: ['教', '育'], reading: 'きょういく', romaji: 'kyouiku', meaningEs: 'educación', jlpt: 4 },
  { chars: ['経', '済'], reading: 'けいざい', romaji: 'keizai', meaningEs: 'economía', jlpt: 3 },
  { chars: ['自', '然'], reading: 'しぜん', romaji: 'shizen', meaningEs: 'naturaleza', jlpt: 4 },
  { chars: ['牛', '乳'], reading: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaningEs: 'leche', jlpt: 4 },
  { chars: ['野', '菜'], reading: 'やさい', romaji: 'yasai', meaningEs: 'verdura', jlpt: 4 },
  { chars: ['果', '物'], reading: 'くだもの', romaji: 'kudamono', meaningEs: 'fruta', jlpt: 4 },
  { chars: ['空', '港'], reading: 'くうこう', romaji: 'kuukou', meaningEs: 'aeropuerto', jlpt: 4 },
  { chars: ['海', '岸'], reading: 'かいがん', romaji: 'kaigan', meaningEs: 'costa', jlpt: 4 },
  { chars: ['旅', '館'], reading: 'りょかん', romaji: 'ryokan', meaningEs: 'pensión tradicional', jlpt: 4 },
  { chars: ['運', '動'], reading: 'うんどう', romaji: 'undou', meaningEs: 'movimiento', jlpt: 4 },
  { chars: ['情', '報'], reading: 'じょうほう', romaji: 'jouhou', meaningEs: 'información', jlpt: 3 },
  { chars: ['植', '物'], reading: 'しょくぶつ', romaji: 'shokubutsu', meaningEs: 'planta', jlpt: 4 },
  { chars: ['動', '物'], reading: 'どうぶつ', romaji: 'doubutsu', meaningEs: 'animal', jlpt: 4 },
  { chars: ['工', '作'], reading: 'こうさく', romaji: 'kousaku', meaningEs: 'fabricación', jlpt: 4 },
  { chars: ['洗', '濯'], reading: 'せんたく', romaji: 'sentaku', meaningEs: 'lavado', jlpt: 3 },
  { chars: ['掃', '除'], reading: 'そうじ', romaji: 'souji', meaningEs: 'limpieza', jlpt: 3 },
  { chars: ['読', '書'], reading: 'どくしょ', romaji: 'dokusho', meaningEs: 'lectura', jlpt: 5 },
  { chars: ['言', '葉'], reading: 'ことば', romaji: 'kotoba', meaningEs: 'palabra', jlpt: 4 },
  { chars: ['社', '員'], reading: 'しゃいん', romaji: 'shain', meaningEs: 'empleado de empresa', jlpt: 4 },
  { chars: ['地', '位'], reading: 'ちい', romaji: 'chii', meaningEs: 'posición / rango', jlpt: 4 },
  { chars: ['重', '要'], reading: 'じゅうよう', romaji: 'juuyou', meaningEs: 'importante', jlpt: 4 },
  { chars: ['必', '要'], reading: 'ひつよう', romaji: 'hitsuyou', meaningEs: 'necesario', jlpt: 3 },
  { chars: ['可', '能'], reading: 'かのう', romaji: 'kanou', meaningEs: 'posible', jlpt: 5 },
  { chars: ['関', '係'], reading: 'かんけい', romaji: 'kankei', meaningEs: 'relación', jlpt: 3 },
  { chars: ['状', '態'], reading: 'じょうたい', romaji: 'joutai', meaningEs: 'estado / situación', jlpt: 3 },
  { chars: ['結', '果'], reading: 'けっか', romaji: 'kekka', meaningEs: 'resultado', jlpt: 3 },
  { chars: ['原', '因'], reading: 'げんいん', romaji: 'genin', meaningEs: 'causa', jlpt: 3 },
  { chars: ['目', '的'], reading: 'もくてき', romaji: 'mokuteki', meaningEs: 'propósito / objetivo', jlpt: 5 },
  { chars: ['手', '段'], reading: 'てだん', romaji: 'tedan', meaningEs: 'medio / recurso', jlpt: 4 },
  { chars: ['条', '件'], reading: 'じょうけん', romaji: 'jouken', meaningEs: 'condición', jlpt: 3 },
  { chars: ['環', '境'], reading: 'かんきょう', romaji: 'kankyou', meaningEs: 'entorno / ambiente', jlpt: 2 },
  { chars: ['企', '業'], reading: 'きぎょう', romaji: 'kigyou', meaningEs: 'corporación', jlpt: 4 },
  { chars: ['組', '合'], reading: 'くみあい', romaji: 'kumiai', meaningEs: 'alianza / asociación', jlpt: 3 },
  { chars: ['石', '頭'], reading: 'いしだりゅう', romaji: 'ishidaryuu', meaningEs: 'cabeza de piedra', jlpt: 3 },
];

/** Devuelve el compuesto formado por los kanjis indicados, si existe. */
export function findCompound(chars: string[]): Compound | undefined {
  const key = chars.join('');
  return COMPOUNDS.find((compound) => compound.chars.join('') === key);
}
