-- H2 演示用建表脚本（MODE=MySQL）
DROP TABLE IF EXISTS resume;
DROP TABLE IF EXISTS template;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  password    VARCHAR(100) NOT NULL,
  nickname    VARCHAR(50),
  avatar      VARCHAR(255),
  role        TINYINT DEFAULT 0,
  status      TINYINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE template (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  preview_url VARCHAR(255),
  css_style   CLOB,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT NOT NULL,
  template_id         INT,
  title               VARCHAR(100),
  real_name           VARCHAR(50),
  gender              TINYINT,
  birthday            DATE,
  phone               VARCHAR(30),
  email               VARCHAR(100),
  avatar              VARCHAR(255),
  summary             CLOB,
  education           CLOB,
  work_experience     CLOB,
  project_experience  CLOB,
  skills              CLOB,
  self_evaluation     CLOB,
  intention           CLOB,
  status              TINYINT DEFAULT 1,
  view_count          INT DEFAULT 0,
  create_time         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO template (name, description, css_style) VALUES
  ('简约单栏', '互联网岗位投递，一页装下', 'body{font-family:"Microsoft YaHei"}'),
  ('经典双栏', '左侧基本信息、右侧经历', 'body{display:flex}'),
  ('学术风', '升学 / 科研岗，突出论文与项目', 'body{line-height:1.6}');

-- 演示账号：demo / 123456
INSERT INTO user (username, password, nickname) VALUES ('demo', '123456', '演示用户');
INSERT INTO resume (user_id, template_id, title, real_name, gender, phone, email, summary, skills, intention)
VALUES (1, 1, '我的第一份简历', '刘永添', 1, '15671677987', 'demo@example.com',
        '信息管理与信息系统专业，GPA 3.86/4.00，专业排名 1/71。',
        'Java / Spring Boot / MySQL / Vue', '后端开发实习生');
