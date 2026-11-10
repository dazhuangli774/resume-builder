-- 简历生成系统 · 数据库初始化脚本
-- MySQL 8.0+，字符集 utf8mb4

CREATE DATABASE IF NOT EXISTS `resume`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `resume`;

-- ---------------------------------------------------------------
-- 用户表
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id`          INT          NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username`    VARCHAR(50)  NOT NULL COMMENT '登录名',
  `password`    VARCHAR(100) NOT NULL COMMENT '口令（当前为明文，生产需改为 BCrypt）',
  `nickname`    VARCHAR(50)  DEFAULT NULL COMMENT '昵称',
  `avatar`      VARCHAR(255) DEFAULT NULL COMMENT '头像地址',
  `role`        TINYINT      DEFAULT 0 COMMENT '0 普通用户 / 1 管理员',
  `status`      TINYINT      DEFAULT 1 COMMENT '1 正常 / 0 禁用',
  `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户';

-- ---------------------------------------------------------------
-- 模板表
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `template` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(50)  NOT NULL COMMENT '模板名',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '模板说明',
  `preview_url` VARCHAR(255) DEFAULT NULL COMMENT '预览图地址',
  `css_style`   TEXT         COMMENT '模板样式（CSS）',
  `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历模板';

-- ---------------------------------------------------------------
-- 简历表（教育/工作/项目/技能等以 JSON 字符串存放，便于前端整体存取）
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `resume` (
  `id`                   INT          NOT NULL AUTO_INCREMENT,
  `user_id`              INT          NOT NULL COMMENT '所属用户',
  `template_id`          INT          DEFAULT NULL COMMENT '所用模板',
  `title`                VARCHAR(100) DEFAULT NULL COMMENT '简历标题',
  `real_name`            VARCHAR(50)  DEFAULT NULL COMMENT '姓名',
  `gender`               TINYINT      DEFAULT NULL COMMENT '1 男 / 2 女',
  `birthday`             DATE         DEFAULT NULL,
  `phone`                VARCHAR(30)  DEFAULT NULL,
  `email`                VARCHAR(100) DEFAULT NULL,
  `avatar`               VARCHAR(255) DEFAULT NULL,
  `summary`              TEXT         COMMENT '个人简介 / AI 生成',
  `education`            TEXT         COMMENT '教育经历 JSON',
  `work_experience`      TEXT         COMMENT '工作经历 JSON',
  `project_experience`   TEXT         COMMENT '项目经历 JSON',
  `skills`               TEXT         COMMENT '专业技能',
  `self_evaluation`      TEXT         COMMENT '自我评价',
  `intention`            TEXT         COMMENT '求职意向',
  `status`               TINYINT      DEFAULT 1 COMMENT '1 正常 / 0 删除',
  `view_count`           INT          DEFAULT 0,
  `create_time`          DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `update_time`          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `fk_resume_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历';

-- ---------------------------------------------------------------
-- 初始模板
-- ---------------------------------------------------------------
INSERT INTO `template` (`name`, `description`, `css_style`) VALUES
  ('简约单栏', '适合互联网岗位投递，信息密度高、一页装下',   'body{font-family:"Microsoft YaHei";color:#222}'),
  ('经典双栏', '左侧基本信息、右侧经历，适合经历较多的候选人', 'body{font-family:"Microsoft YaHei";display:flex}'),
  ('学术风',   '适合升学 / 科研岗，突出论文与项目',            'body{font-family:"Times New Roman";line-height:1.6}');
