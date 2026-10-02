// 繁中守衛：簡體字、大陸用語、opencc cn→twp 不變性三層。

import * as OpenCC from 'opencc-js';

// 手選、只在簡體中文使用的常用字；抄自 data/tests/test_traditional.py 的 SIMPLIFIED_ONLY（兩處獨立維護）。
// 不含簡繁同形或繁體亦通行的字（如 后、里、只、干、云、台、面）。
export const SIMPLIFIED_ONLY = new Set(
  '这们个来时为说国学对会发动实现点种头长关机样经过电话问题应车东设计网络医药书区级单词义语读写听' +
    '门开买卖灯轻变认识觉习惯边远运进还选择记忆钱银铁钟错误饭馆鸡鱼鸟马龙风飞广产业专严两乱亚亲仅从众' +
    '优伤传伞无气农华厅历压县号吗吓员围图圆场坏块坚处备复够夺奋妇妈孙宁宝宽寻导尘层岁岛带帮师庆库废' +
    '张弹强归录彻径忧怀态总恋恶惊战户扩扫扬护报担拥挤损换敌数断旧显晓术杀杂权条杨极构枪标树桥检欢' +
    '毕汇汉汤沟没泪洁浅测济浓涨渐湾满灭灵炉烂热爱爷牵犹独猎献环疗盖盘码础确离积称稳穷竞笔笼筑签简粮' +
    '紧红约纪纯纸纹线练组细织终结绕绘给统继绩续绿罗职联肤胁脏脑脚艺节荣获虑虽虾补装见观规视览订讨' +
    '让训议讯讲许论访证评诉诊译试诗诚询该详请诸课谁调谈谊谢贝负贡财责货质贫购贯贵费贴贸资赏赛赞赶趋' +
    '跃践轨转轮软较辆辈达迁连迟适递遗邮邻酱释针钓钢钥铅链销锁锅锻镇闪闭闲间闹闻阅队阳阴阶际陆陈险随' +
    '隐难雾静韩页顶项顺须顾顿预领频颜额飘饥饮饰饱饼驾验骑骗鲜鸭麦黄',
);

// 台灣不用的大陸用語（只收語意明確、台灣另有慣用詞者；繁體字形）。
export const MAINLAND_TERMS = [
  '視頻', '軟件', '硬件', '信息', '網絡', '默認', '打印', '服務器', '屏幕', '鼠標', '短信',
  '出租車', '自行車', '公交車', '地鐵站', '西紅柿', '酸奶', '方便麵', '空調', '互聯網', '外賣',
  '早上好', '質量好', '優盤', '博客', '激光', '內存', '硬盤', '數據庫', '程序員', '菜單欄',
];

// 台／臺 皆為台灣通行寫法，比較前一律視為相同。
const TW_EQUIVALENT = [['臺', '台']];

// opencc twp 會改、但在台灣本來就通行的詞（2026-10-01 以 opencc-js 1.4.2 實測；干擾→幹擾 為誤轉；
// 菜單→選單、對象→物件、消息→訊息 為 2026-10-02 pilot 實際產出撞到：餐廳菜單、交往對象、朋友的消息在台灣就這樣寫；
// 不准→不準、只不過→隻不過 為 2026-10-02 開發端撰寫時撞到）。比較前先移除。
// 傢伙→傢夥、打開→開啟、類型→型別、代碼→程式碼、觸摸→觸控、夾克扣→夾剋扣（斷詞錯，收「夾克」）為 TASK-9 A1 開發端撰寫撞到；
// 圖像、查看、了解、通信、設備、高級 為 TASK-9 A2 撰寫回報（2026-10-02，均為台灣正常用語）。
export const TWP_ACCEPTED = [
  '連接', '支持', '項目', '數據', '點擊', '文件', '干擾', '祕密', '菜單', '對象', '消息', '不准', '只不過',
  '傢伙', '打開', '類型', '代碼', '觸摸', '夾克', '圖像', '查看', '了解', '通信', '設備', '高級',
];

const toTaiwan = OpenCC.Converter({ from: 'cn', to: 'twp' });

const normalizeEquivalent = (text) =>
  TW_EQUIVALENT.reduce((s, [from, to]) => s.replaceAll(from, to), text);
const stripAccepted = (text) => TWP_ACCEPTED.reduce((s, phrase) => s.replaceAll(phrase, '　'), text);

// 回傳 { code, message } 陣列；text 為一個繁中欄位。
export function checkZh(text) {
  const errors = [];
  if (!/\p{Script=Han}/u.test(text)) {
    errors.push({ code: 'ZH_MISSING', message: '沒有任何中文字' });
    return errors;
  }
  const simplified = [...new Set([...text].filter((ch) => SIMPLIFIED_ONLY.has(ch)))];
  if (simplified.length) {
    errors.push({ code: 'SIMPLIFIED', message: `含簡體字：${simplified.join('')}` });
  }
  const terms = MAINLAND_TERMS.filter((term) => text.includes(term));
  if (terms.length) {
    errors.push({ code: 'MAINLAND_TERM', message: `含大陸用語：${terms.join('、')}` });
  }
  const stripped = stripAccepted(text);
  const converted = toTaiwan(stripped);
  if (normalizeEquivalent(converted) !== normalizeEquivalent(stripped)) {
    errors.push({ code: 'ZH_NOT_TW', message: `opencc cn→twp 會改成：${converted}` });
  }
  return errors;
}
