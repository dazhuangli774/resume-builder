import { getDb } from "../api/queries/connection";

async function setup() {
  const db = getDb();

  // Drop if exists
  try {
    await db.execute("DROP TABLE IF EXISTS peots");
    console.log("Dropped old peots table");
  } catch { /* ignore */ }

  // Create table
  await db.execute(`
    CREATE TABLE peots (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      gender ENUM('男', '女') DEFAULT '男' NOT NULL,
      dynasty VARCHAR(50) NOT NULL,
      title VARCHAR(255),
      style VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Created peots table");

  // Insert seed data
  await db.execute(`
    INSERT INTO peots (name, gender, dynasty, title, style) VALUES
    ('李白', '男', '唐', '诗仙', '浪漫主义，豪放飘逸'),
    ('杜甫', '男', '唐', '诗圣', '现实主义，沉郁顿挫'),
    ('王维', '男', '唐', '诗佛', '山水田园，诗中有画'),
    ('白居易', '男', '唐', '诗魔', '通俗易懂，关注民生'),
    ('苏轼', '男', '宋', '东坡居士', '豪放旷达，多才多艺'),
    ('李清照', '女', '宋', '易安居士', '婉约细腻，情感真挚'),
    ('辛弃疾', '男', '宋', '稼轩居士', '豪放激昂，爱国情怀'),
    ('陆游', '男', '宋', '放翁', '爱国诗人，气势磅礴'),
    ('陶渊明', '男', '东晋', '五柳先生', '田园诗人，归隐自然'),
    ('屈原', '男', '战国', '中华诗祖', '浪漫主义，楚辞开创者'),
    ('孟浩然', '男', '唐', '孟山人', '山水田园，清淡自然'),
    ('韩愈', '男', '唐', '韩昌黎', '古文运动，雄奇奔放'),
    ('柳宗元', '男', '唐', '柳河东', '山水游记，冷峻峭拔'),
    ('李商隐', '男', '唐', '樊南生', '朦胧婉约，深情绵邈'),
    ('杜牧', '男', '唐', '杜樊川', '咏史诗，俊爽清丽'),
    ('欧阳修', '男', '宋', '醉翁', '散文大家，平易流畅'),
    ('王安石', '男', '宋', '王荆公', '政治改革，峭拔深刻'),
    ('纳兰性德', '男', '清', '容若', '婉约词风，哀感顽艳'),
    ('龚自珍', '男', '清', '定庵', '思想启蒙，瑰丽奇肆'),
    ('刘禹锡', '男', '唐', '诗豪', '咏史诗，豪迈奔放')
  `);

  console.log("Inserted 20 poets");
}

setup().catch(console.error);
