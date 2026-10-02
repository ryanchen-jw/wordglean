// 介面文案繁中守衛：簡體字、大陸用語、opencc cn→twp 反查三層。
// 改寫自 content/scripts/lib/zh-guard.mjs（TASK-8 分支，題庫用）；兩份獨立維護。
// 與題庫版的差別：不含中文的字串略過（介面有「B1」「{current}／{total}」）；豁免清單較窄、大陸用語清單加介面常見詞。

import * as OpenCC from 'opencc-js';

// 手選、只在簡體中文使用的常用字；抄自 zh-guard 的 SIMPLIFIED_ONLY。
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

// 台灣介面不用的大陸用語（繁體字形）→ 台灣慣用說法。前段抄自 zh-guard，後段為介面常見詞。
export const MAINLAND_TERMS = {
  視頻: '影片', 軟件: '軟體', 硬件: '硬體', 信息: '訊息', 網絡: '網路', 默認: '預設', 打印: '列印',
  服務器: '伺服器', 屏幕: '螢幕', 鼠標: '滑鼠', 短信: '簡訊', 內存: '記憶體', 硬盤: '硬碟', 數據庫: '資料庫',
  程序員: '工程師', 菜單欄: '選單列', 優盤: '隨身碟', 博客: '部落格', 互聯網: '網際網路',
  設置: '設定', 保存: '儲存', 加載: '載入', 刷新: '重新整理', 用戶: '使用者', 登錄: '登入', 賬號: '帳號',
  賬戶: '帳戶', 鏈接: '連結', 緩存: '快取', 彈窗: '彈出視窗', 激活: '啟用', 卸載: '解除安裝', 音頻: '音訊',
  點擊: '點、點選', 支持: '支援', 文件夾: '資料夾', 反饋: '回饋', 質量: '品質', 搜索: '搜尋', 在線: '線上',
  二維碼: 'QR 碼', 數據: '資料', 菜單: '選單', 界面: '介面', 郵箱: '信箱', 全屏: '全螢幕',
  模板: '範本', 創建: '建立', 添加: '新增、加入', 獲取: '取得', 文本: '文字', 智能: '智慧', 交互: '互動',
  實時: '即時', 批量: '批次', 兼容: '相容', 調用: '呼叫', 粘貼: '貼上', 黏貼: '貼上', 高清: '高畫質',
  視圖: '檢視',
};

// opencc twp 會改、但在台灣介面本來就通行的詞（2026-10-02 以 opencc-js 1.4.2 對 copy-table 實測後逐條收）。
// 比較前先移除。不收題庫版的「點擊、支持、文件」：介面上台灣慣用「點、支援、檔案」。
export const UI_ACCEPTED = [
  '單字庫', // opencc 把「字庫」當字型術語轉成「單字型檔」，誤轉
  '了解', // 了解／瞭解 台灣皆通行（教育部重編國語辭典兩者並收）
  '查看', // 台灣介面通行（opencc 轉「檢視」）
];

// 台／臺 皆為台灣通行寫法，比較前一律視為相同。
const TW_EQUIVALENT = [['臺', '台']];

const toTaiwan = OpenCC.Converter({ from: 'cn', to: 'twp' });
const han = /\p{Script=Han}/u;

const normalizeEquivalent = (text) => TW_EQUIVALENT.reduce((s, [from, to]) => s.replaceAll(from, to), text);
const stripAccepted = (text) => UI_ACCEPTED.reduce((s, phrase) => s.replaceAll(phrase, '　'), text);
// 變數 {name} 不是文案，先拿掉
const stripPlaceholders = (text) => text.replace(/\{[A-Za-z][A-Za-z0-9]*\}/g, '　');

// 回傳 { code, message } 陣列；不含中文字的字串回傳 []。
export function checkZhUi(text) {
  if (!han.test(text)) return [];
  const errors = [];
  const simplified = [...new Set([...text].filter((ch) => SIMPLIFIED_ONLY.has(ch)))];
  if (simplified.length) errors.push({ code: 'SIMPLIFIED', message: `含簡體字：${simplified.join('')}` });
  const terms = Object.keys(MAINLAND_TERMS).filter((term) => text.includes(term));
  if (terms.length) {
    errors.push({
      code: 'MAINLAND_TERM',
      message: `含大陸用語：${terms.map((t) => `${t}（台灣用「${MAINLAND_TERMS[t]}」）`).join('、')}`,
    });
  }
  const stripped = stripAccepted(stripPlaceholders(text));
  const converted = toTaiwan(stripped);
  if (normalizeEquivalent(converted) !== normalizeEquivalent(stripped)) {
    errors.push({ code: 'ZH_NOT_TW', message: `opencc cn→twp 會改成：${converted}` });
  }
  return errors;
}

// 從 copy-table.json（rows[].key／text）或 zh-TW.json（扁平或巢狀的字串值）取出 [key, text]。
export function collectStrings(json) {
  if (Array.isArray(json?.rows)) return json.rows.map((row) => [row.key, row.text]);
  const out = [];
  const walk = (node, path) => {
    if (typeof node === 'string') out.push([path, node]);
    else if (node && typeof node === 'object') {
      // 底線開頭是中繼欄位（_status、_pendingG3），不是文案
      for (const [k, v] of Object.entries(node)) if (!k.startsWith('_')) walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk(json, '');
  return out;
}
