import { getDb } from "../api/queries/connection";
import { peots } from "./schema";

async function seedPeots() {
  const db = getDb();

  const existing = await db.select().from(peots);
  if (existing.length > 0) {
    console.log("Peots already seeded, skipping.");
    return;
  }

  await db.insert(peots).values([
    { name: "李白", gender: "男", dynasty: "唐", title: "诗仙", style: "浪漫主义，豪放飘逸" },
    { name: "杜甫", gender: "男", dynasty: "唐", title: "诗圣", style: "现实主义，沉郁顿挫" },
    { name: "王维", gender: "男", dynasty: "唐", title: "诗佛", style: "山水田园，诗中有画" },
    { name: "白居易", gender: "男", dynasty: "唐", title: "诗魔", style: "通俗易懂，关注民生" },
    { name: "苏轼", gender: "男", dynasty: "宋", title: "东坡居士", style: "豪放旷达，多才多艺" },
    { name: "李清照", gender: "女", dynasty: "宋", title: "易安居士", style: "婉约细腻，情感真挚" },
    { name: "辛弃疾", gender: "男", dynasty: "宋", title: "稼轩居士", style: "豪放激昂，爱国情怀" },
    { name: "陆游", gender: "男", dynasty: "宋", title: "放翁", style: "爱国诗人，气势磅礴" },
    { name: "陶渊明", gender: "男", dynasty: "东晋", title: "五柳先生", style: "田园诗人，归隐自然" },
    { name: "屈原", gender: "男", dynasty: "战国", title: "中华诗祖", style: "浪漫主义，楚辞开创者" },
    { name: "孟浩然", gender: "男", dynasty: "唐", title: "孟山人", style: "山水田园，清淡自然" },
    { name: "韩愈", gender: "男", dynasty: "唐", title: "韩昌黎", style: "古文运动，雄奇奔放" },
    { name: "柳宗元", gender: "男", dynasty: "唐", title: "柳河东", style: "山水游记，冷峻峭拔" },
    { name: "李商隐", gender: "男", dynasty: "唐", title: "樊南生", style: "朦胧婉约，深情绵邈" },
    { name: "杜牧", gender: "男", dynasty: "唐", title: "杜樊川", style: "咏史诗，俊爽清丽" },
    { name: "欧阳修", gender: "男", dynasty: "宋", title: "醉翁", style: "散文大家，平易流畅" },
    { name: "王安石", gender: "男", dynasty: "宋", title: "王荆公", style: "政治改革，峭拔深刻" },
    { name: "纳兰性德", gender: "男", dynasty: "清", title: "容若", style: "婉约词风，哀感顽艳" },
    { name: "龚自珍", gender: "男", dynasty: "清", title: "定庵", style: "思想启蒙，瑰丽奇肆" },
    { name: "刘禹锡", gender: "男", dynasty: "唐", title: "诗豪", style: "咏史诗，豪迈奔放" },
  ]);

  console.log("Seeded 20 poets.");
}

seedPeots().catch(console.error);
