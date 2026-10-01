"""繁中化檢查（AC#3）：輸出不得含簡體字。

SIMPLIFIED_ONLY 為手選、只在簡體中文使用的常用字（繁體另有正字，如 这→這、们→們），
不含簡繁同形或繁體亦通行的字（如 后、里、只、干、云、台、面、缺；据 在「拮据」為繁體正字）。
"""

from conftest import DATA

SIMPLIFIED_ONLY = set(
    "这们个来时为说国学对会发动实现点种头长关机样经过电话问题应车东设计网络医药书区级单词义语读写听"
    "门开买卖灯轻变认识觉习惯边远运进还选择记忆钱银铁钟错误饭馆鸡鱼鸟马龙风飞广产业专严两乱亚亲仅从众"
    "优伤传伞无气农华厅历压县号吗吓员围图圆场坏块坚处备复够夺奋妇妈孙宁宝宽寻导尘层岁岛带帮师庆库废"
    "张弹强归录彻径忧怀态总恋恶惊战户扩扫扬护报担拥挤损换敌数断旧显晓术杀杂权条杨极构枪标树桥检欢"
    "毕汇汉汤沟没泪洁浅测济浓涨渐湾满灭灵炉烂热爱爷牵犹独猎献环疗盖盘码础确离积称稳穷竞笔笼筑签简粮"
    "紧红约纪纯纸纹线练组细织终结绕绘给统继绩续绿罗职联肤胁脏脑脚艺节荣获虑虽虾补装见观规视览订讨"
    "让训议讯讲许论访证评诉诊译试诗诚询该详请诸课谁调谈谊谢贝负贡财责货质贫购贯贵费贴贸资赏赛赞赶趋"
    "跃践轨转轮软较辆辈达迁连迟适递遗邮邻酱释针钓钢钥铅链销锁锅锻镇闪闭闲间闹闻阅队阳阴阶际陆陈险随"
    "隐难雾静韩页顶项顺须顾顿预领频颜额飘饥饮饰饱饼驾验骑骗鲜鸭麦黄"
)


def chinese_text(lexicon, shards):
    for e in lexicon:
        if e["glossZh"]:
            yield e["id"], e["glossZh"]
    for s in shards.values():
        for w, (_ph, gloss) in s["e"].items():
            yield w, gloss


def test_char_list_is_really_simplified():
    import opencc

    t = opencc.OpenCC("s2t")
    for ch in SIMPLIFIED_ONLY:
        assert t.convert(ch) != ch, ch


def test_no_simplified_characters_anywhere(lexicon, shards):
    bad = [(k, g) for k, g in chinese_text(lexicon, shards) if SIMPLIFIED_ONLY & set(g)]
    assert bad == [], bad[:20]


def test_sample_report_exists():
    # 人工抽 50 條的紀錄（scripts/samples.py 產生、執行長可直接閱讀）
    assert (DATA / "reports" / "sample50-zh.md").exists()
