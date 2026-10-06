// 授權與致謝頁的條目（TASK-21）：分節與順序照 repo 根 NOTICE；文字在 zh-TW.json credits.<id>。
// NOTICE 增刪條目時同步改這裡與 zh-TW.json，LicensesScreen.test.tsx 會比對兩者
export const CREDIT_SECTIONS = [
  { id: 'data', credits: ['cefrj', 'octanove', 'tsl', 'ngsl', 'ecdict', 'phrases'] },
  { id: 'content', credits: ['items', 'curriculum', 'code'] },
  { id: 'ported', credits: ['librelingo'] },
  {
    id: 'runtime',
    credits: [
      'opencc',
      'openccJs',
      'dexie',
      'kokoroJs',
      'transformers',
      'onnxruntime',
      'phonemizer',
      'espeak',
      'kokoroModel',
      'moonshineWeb',
      'moonshineModel',
      'notoSansTc',
      'notoSans',
      'plusJakarta',
      'react',
      'supabaseJs',
      'tsFsrs',
      'lucide',
      'workbox',
    ],
  },
  { id: 'test', credits: ['librispeech'] },
] as const

export type CreditId = (typeof CREDIT_SECTIONS)[number]['credits'][number]
