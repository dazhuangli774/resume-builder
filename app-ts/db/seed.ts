import { getDb } from "../api/queries/connection";
import { templates } from "./schema";

// [name, description, category, [tags], style]
const TEMPLATE_DATA: [string, string, string, string[], string][] = [
  // ====== leftSidebar layout (左侧深色边栏) ======
  ["极简白", "极简白色设计，适合所有场景", "universal", ["简约", "通用"], "minimal"],
  ["商务深蓝", "经典商务深蓝风格", "job", ["商务", "通用"], "professional"],
  ["金融精英", "深蓝金色调，适合投行证券", "job", ["商务", "金融"], "professional"],
  ["行政管理", "稳重商务行政风格", "job", ["商务", "行政"], "professional"],
  ["会计师", "绿色财务专业风格", "job", ["商务", "财务"], "professional"],
  ["科技极客", "暗色科技互联网风格", "job", ["科技", "极客"], "tech"],
  ["前端开发", "蓝色渐变开发者风格", "job", ["科技", "前端"], "tech"],
  ["后端开发", "橙色后端工程师风格", "job", ["科技", "后端"], "tech"],
  ["数据分析", "数据可视化风格", "job", ["科技", "数据"], "tech"],
  ["投资银行", "投行专用高端风格", "job", ["商务", "投行"], "professional"],
  ["咨询顾问", "咨询行业专业风格", "job", ["商务", "咨询"], "professional"],
  ["供应链管理", "供应链物流商务风", "job", ["商务", "供应链"], "professional"],
  ["理工科申请", "学术蓝调工科理科申请", "academic", ["学术", "理工科"], "academic"],
  ["博士申请", "博士申请科研风格", "academic", ["学术", "博士"], "academic"],
  ["硕士申请", "硕士申请通用风格", "academic", ["学术", "硕士"], "academic"],
  ["直博申请", "直博申请学术风格", "academic", ["学术", "直博"], "academic"],
  ["保研推免", "保研推免专用风格", "academic", ["学术", "保研"], "academic"],

  // ====== topHeader layout (顶部彩色header) ======
  ["清新绿", "薄荷绿配色，清新自然", "universal", ["简约", "清新"], "minimal"],
  ["活力橙", "阳光橙色调，积极向上", "universal", ["简约", "活力"], "minimal"],
  ["天空蓝", "天蓝色调，清爽专业", "universal", ["简约", "清爽"], "minimal"],
  ["珊瑚渐变", "珊瑚橙渐变温暖设计", "universal", ["简约", "温暖"], "minimal"],
  ["薰衣草", "紫色浪漫优雅风格", "universal", ["简约", "优雅"], "minimal"],
  ["石墨灰", "灰色稳重商务风", "universal", ["简约", "稳重"], "minimal"],
  ["销售精英", "红色商业风格，突出业绩", "job", ["商务", "销售"], "professional"],
  ["人力资源", "玫瑰金商务人事风格", "job", ["商务", "HR"], "professional"],
  ["产品经理", "突出产品思维数据", "job", ["科技", "产品"], "tech"],
  ["云计算", "云计算技术风格", "job", ["科技", "云计算"], "tech"],
  ["应届生通用", "清新绿应届生求职", "universal", ["活力", "应届"], "fresh"],
  ["实习生通用", "实习生通用清新风格", "universal", ["活力", "实习"], "fresh"],
  ["校招通用", "校招专用蓝色风格", "universal", ["活力", "校招"], "fresh"],
  ["在职提升", "社招在职提升风格", "job", ["商务", "社招"], "professional"],
  ["MBA申请", "高管风格工商管理", "academic", ["学术", "MBA"], "academic"],
  ["留学申请", "国际留学申请专用", "academic", ["学术", "留学"], "academic"],

  // ====== center layout (居中) ======
  ["温柔粉", "淡雅粉色，温柔知性", "universal", ["简约", "温柔"], "minimal"],
  ["学术科研", "严谨规范硕博申请", "academic", ["学术", "科研"], "academic"],
  ["文科申请", "典雅人文社科申请", "academic", ["学术", "文科"], "academic"],
  ["教育教师", "暖黄教育行业风格", "academic", ["学术", "教育"], "academic"],
  ["律师", "法律行业专业风格", "job", ["商务", "法律"], "professional"],
  ["古典学术", "古典奢华学术风格", "academic", ["学术", "古典"], "academic"],
  ["中国风", "传统中国红金元素", "academic", ["学术", "中国风"], "academic"],

  // ====== doubleCol layout (左右双列) ======
  ["运营增长", "数据驱动运营风格", "job", ["科技", "运营"], "tech"],
  ["网络安全", "安全防护专业风格", "job", ["科技", "安全"], "tech"],
  ["人工智能", "AI算法专业风格", "job", ["科技", "AI"], "tech"],
  ["移动开发", "移动开发专业风格", "job", ["科技", "移动端"], "tech"],
  ["测试工程师", "测试专业严谨风格", "job", ["科技", "测试"], "tech"],
  ["运维工程师", "运维监控技术风格", "job", ["科技", "运维"], "tech"],
  ["算法工程师", "算法研究专业风格", "job", ["科技", "算法"], "tech"],
  ["大数据开发", "大数据技术风格", "job", ["科技", "大数据"], "tech"],
  ["全栈开发", "全栈工程师通用风格", "job", ["科技", "全栈"], "tech"],
  ["审计师", "审计专用严谨风格", "job", ["商务", "审计"], "professional"],
  ["税务师", "税务专业稳重风格", "job", ["商务", "税务"], "professional"],
  ["国际贸易", "外贸国际商务风格", "job", ["商务", "外贸"], "professional"],

  // ====== timeline layout (时间线) ======
  ["时间线", "纵向时间线布局", "universal", ["简约", "时间线"], "minimal"],
  ["区块链开发", "区块链技术风格", "job", ["科技", "区块链"], "tech"],
  ["嵌入式开发", "嵌入式硬件风格", "job", ["科技", "嵌入式"], "tech"],
  ["医疗健康", "白青医疗护理风格", "job", ["活力", "医疗"], "fresh"],
  ["社招通用", "社招通用稳重风格", "job", ["活力", "社招"], "fresh"],
  ["转行者", "转行专用橙色风格", "job", ["活力", "转行"], "fresh"],

  // ====== threeTone layout (三区块彩色) ======
  ["创意设计师", "个性鲜明展示创造力", "job", ["创意", "设计"], "creative"],
  ["UI设计师", "UI设计专业风格", "job", ["创意", "UI设计"], "creative"],
  ["平面设计师", "平面设计创意风格", "job", ["创意", "平面设计"], "creative"],
  ["摄影师", "黑白摄影作品集风格", "job", ["创意", "摄影"], "creative"],
  ["新媒体运营", "渐变紫粉新媒体风格", "job", ["创意", "新媒体"], "creative"],
  ["插画风格", "插画艺术创意风格", "job", ["创意", "插画"], "creative"],
  ["音乐艺术", "音乐艺术创意风格", "job", ["创意", "音乐"], "creative"],
  ["游戏设计师", "游戏设计创意风格", "job", ["创意", "游戏"], "creative"],

  // ====== topBanner layout (顶部大banner) ======
  ["时尚设计", "粉黑白时尚行业风格", "job", ["创意", "时尚"], "creative"],
  ["市场营销", "活力橙红营销风格", "job", ["创意", "营销"], "creative"],
  ["跨境电商", "跨境电商活力风格", "job", ["商务", "跨境电商"], "professional"],
  ["酒店管理", "酒店行业高端风格", "job", ["商务", "酒店"], "professional"],
  ["高管精英", "深色背景高端商务风格", "job", ["商务", "高管"], "professional"],
  ["创业CEO", "商务创业领导者风", "job", ["活力", "创业"], "fresh"],

  // ====== cardGrid layout (卡片网格) ======
  ["景观设计师", "景观设计自然风格", "job", ["创意", "景观"], "creative"],
  ["珠宝设计师", "珠宝设计高端风格", "job", ["创意", "珠宝"], "creative"],
  ["工业设计师", "工业设计专业风格", "job", ["创意", "工业设计"], "creative"],
  ["室内设计", "室内设计艺术风格", "job", ["创意", "室内设计"], "creative"],
  [" architect", "建筑设计蓝图风格", "job", ["创意", "建筑"], "creative"],

  // ====== Others ======
  ["法律专业", "法律专业严谨风格", "job", ["商务", "法律"], "professional"],
  ["税务", "税务专用风格", "job", ["商务", "税务"], "professional"],
  ["圆形头像", "圆形头像居中风格", "universal", ["简约", "头像"], "minimal"],
  ["客服专员", "友善蓝绿客服风格", "job", ["活力", "客服"], "fresh"],
  ["物流管理", "蓝色供应链物流风", "job", ["活力", "物流"], "fresh"],
  ["波浪", "波浪形头部创意风格", "universal", ["创意", "波浪"], "creative"],
  ["动画师", "动画设计艺术风格", "job", ["创意", "动画"], "creative"],
  ["左右分屏", "左右分屏对比风格", "universal", ["简约", "分屏"], "minimal"],
  ["前端", "前端开发专业风格", "job", ["科技", "前端"], "tech"],
  ["社工公益", "大地暖色公益风格", "job", ["活力", "公益"], "fresh"],
  ["校园社团", "青春活力社团风格", "universal", ["活力", "校园"], "fresh"],
  ["体育健康", "动感运动健康风格", "universal", ["活力", "体育"], "fresh"],
  ["堆叠", "堆叠卡片创意风格", "universal", ["创意", "堆叠"], "creative"],
  ["水彩艺术", "水彩花卉文艺清新", "job", ["创意", "文艺"], "creative"],
  ["心理咨询", "心理咨询专业风格", "job", ["活力", "心理"], "fresh"],
  ["土木工程", "土木工程严谨风格", "job", ["科技", "土木"], "tech"],
  ["税务师", "税务师专用风格", "job", ["商务", "税务"], "professional"],
  ["跨境电商", "跨境电商专用风格", "job", ["商务", "电商"], "professional"],
];

async function seed() {
  const db = getDb();

  const existing = await db.select().from(templates);
  if (existing.length > 0) {
    console.log("Templates already seeded, skipping.");
    return;
  }

  await db.insert(templates).values(
    TEMPLATE_DATA.map(([name, description, category, tags, style]) => ({
      name,
      description,
      thumbnail: name,
      category: category as "job" | "academic" | "universal",
      tags,
      style: style as "minimal" | "professional" | "creative" | "academic" | "tech" | "elegant" | "fresh",
    }))
  );

  console.log(`Seeded ${TEMPLATE_DATA.length} templates.`);
}

seed().catch(console.error);
