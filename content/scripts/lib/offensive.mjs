// 分級測驗不該出現的字（TASK-17）。本專案自訂名單，未取用任何外部名單（外部名單另有授權）。
//
// 真字（OFFENSIVE_WORDS，整字比對）：2026-10-02 以一份粗話／侮辱／歧視／性／創傷用語種子清單掃
// data/lexicon/lexicon.json，從命中的字人工挑出「當測驗題會冒犯或令人不適」者。
// 中性的基本字（fat、ugly、kill、drug、naked、gay、sexual 等）保留——字典義中性、課綱照常會教。
export const OFFENSIVE_WORDS = [
  // 粗話、咒罵語
  'bloody', 'damn', 'hell', 'bum',
  // 以侮辱為主要用法
  'idiot', 'stupid', 'dumb', 'prick',
  // 歧視用語
  'retard', 'cripple', 'queer',
  // 性暗示、低俗
  'raunchy', 'sexy', 'lust',
  // 創傷性題材
  'rape', 'suicide',
];

// 課綱排除字（創辦人裁示 2026-10-03）：辱罵義遠比課綱所教的義項常見，不排進任何小課。
// 排課器照常讓它們在 word-topics.json 佔位、產出時才剔除，其他字不因此跨課位移（見 allocate.mjs 規則 6）。
export const CURRICULUM_EXCLUDED_WORDS = ['gook', 'retard'];

// 假字（OFFENSIVE_SUBSTRINGS，子字串比對）：產生出的假字含這些字串即丟，避免拼出近似髒話的字
export const OFFENSIVE_SUBSTRINGS = [
  'fuck', 'shit', 'cunt', 'nigg', 'fag', 'slut', 'whore', 'rape', 'porn', 'piss', 'cock', 'dick',
  'twat', 'wank', 'bitch', 'puss', 'anus', 'penis', 'vagin', 'sex', 'tit', 'nazi', 'kill',
];
