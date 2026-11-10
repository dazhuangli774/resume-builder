-- app-ts 本地登录所需的最小迁移（在已有 resume_db 上执行）
-- 作用：给 users 表加口令字段，用于用户名 + 口令登录；Kimi OAuth 建的用户该列为空。

ALTER TABLE `users`
  ADD COLUMN `password` VARCHAR(255) NULL COMMENT 'scrypt 哈希（salt:hash），仅本地登录用户有值';

-- 可选：全新环境直接用 drizzle 建表即可（npm run db:push），无需本文件。
