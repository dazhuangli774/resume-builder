# 简历生成系统（多个实现）

「在线简历生成」课程设计的完整代码集合。同一个题目前后做了**三套实现**，外加一个独立的登录/用户管理服务，全部收在本仓库里，方便对照各阶段的技术选型与完成度。

| 子目录 | 技术栈 | 定位 | 状态 |
|---|---|---|---|
| [`backend-spring/`](backend-spring) | Java 17 · Spring Boot 3.5 · MyBatis · JWT · MySQL | 主实现的后端（简历 CRUD、模板、AI） | ✅ 编译通过（`mvn package`），需 MySQL |
| [`frontend-vue/`](frontend-vue) | Vue 2.6 · Element UI · Axios | 主实现的前端（7 个页面） | ⚠️ 未在本环境安装依赖验证 |
| [`login-service/`](login-service) | Java 17 · Spring Boot 3.2 · MyBatis · PageHelper | 独立的登录 / 用户管理服务（含后台用户列表、增删改静态页） | ⚠️ 独立可编译，库名与主实现不同 |
| [`app-ts/`](app-ts) | TypeScript · Hono · React 18 · Vite · Drizzle ORM · MySQL · Kimi 开放平台 | 全栈重写版：9 个页面、简历/模板/AI/管理员四组路由、Kimi OAuth 登录与简历润色 | ⚠️ 需自备 `.env`（见下），未在本环境验证构建 |
| [`sql/`](sql) | — | 主实现（`backend-spring`）的建库建表脚本 | ✅ |

---

## 三套实现的关系

```
第一阶段  login-service        用户登录/注册 + 后台用户管理（Spring Boot 3.2，页面是原生 HTML + Vue2 CDN）
              ↓
第二阶段  backend-spring       简历业务后端（Spring Boot 3.5 + MyBatis + JWT）
          frontend-vue         配套前端（Vue CLI + Element UI）
              ↓
第三阶段  app-ts               全栈重写（Hono + React + Drizzle），补齐模板、AI、管理员与 Kimi 登录
```

三套的数据库名不一致：`backend-spring` 用 `resume`，`login-service` 用 `resume_db`，`app-ts` 由 `DATABASE_URL` 决定。这是分阶段迭代的痕迹，**不是**同一套系统可以混跑。

---

## 1. backend-spring（主实现后端）

```bash
mysql -uroot -p < sql/schema.sql          # 建库建表 + 3 套初始模板

cd backend-spring
export DB_PASSWORD=你的口令                # 默认空
export DEEPSEEK_API_KEY=sk-xxxx           # 可选，不配则 AI 返回占位文案
mvn spring-boot:run                       # http://localhost:8080
```

接口（统一前缀 `/api`）：

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/user/register`、`/api/user/login` | 注册 / 登录（返回 JWT） |
| GET/POST/PUT/DELETE | `/api/resume`、`/api/resume/{id}`、`/api/resume/list` | 简历 CRUD |
| GET | `/api/template/list`、`/api/template/{id}` | 模板 |
| POST | `/api/ai/summary`、`/api/ai/polish`、`/api/ai/cover-letter` | AI 生成简介 / 润色 / 求职信 |

AI 实现说明：`utils/DeepSeekUtil` 调用 DeepSeek `chat/completions`（JDK 自带 `java.net.http`，无额外 SDK）；**未配置 `DEEPSEEK_API_KEY` 时自动降级为占位文案**，保证不配密钥也能跑通界面。

## 2. frontend-vue（主实现前端）

```bash
cd frontend-vue
npm install
npm run serve      # http://localhost:8081，/api 已代理到 :8080
```

页面：Home / Templates / Editor（求职·升学两套表单）/ Login / Register / UserGuide / About。

## 3. login-service（登录与用户管理）

```bash
cd login-service
mvn spring-boot:run     # http://localhost:8080，静态页 /user_list.html
```

- 库名 `resume_db`，账号口令见 `src/main/resources/application.yml`
- 静态页 `user_list.html` / `user_add.html` / `user_edit.html` 通过 CDN 本地文件（`static/js/vue.js`、`axios-0.18.0.js`）驱动
- `application.yml` 里配置了 `mybatis.mapper-locations=classpath:mapper/*.xml`，但仓库中没有对应 XML（实际使用注解式 Mapper），该配置可删

## 4. app-ts（全栈重写版）

```bash
cd app-ts
cp .env.example .env      # 填入下面的变量
npm install
npm run db:push           # 建表（Drizzle）
npm run dev               # 前端 + API 一起起
```

`.env` 必填项（`.env.example` 有完整注释）：

```
APP_ID / APP_SECRET           # Kimi 开放平台应用凭据
DATABASE_URL                  # MySQL 连接串
KIMI_API_KEY                  # Kimi 平台密钥
VITE_KIMI_AUTH_URL / VITE_APP_ID
OWNER_UNION_ID                # 首个登录者的 unionId，用于授予 admin
```

> ⚠️ 原工程的 `.env` 内含真实密钥，**已从仓库移除**，只保留 `.env.example`。请自行申请凭据。

页面：Home、Editor、Templates、MyResumes、Dashboard、AdminUsers、PeotManager、Login。

---

## 已知问题

1. **口令为明文存储**（`backend-spring`），生产必须改 BCrypt；`JwtUtil` 的密钥已支持 `JWT_SECRET` 环境变量。
2. `backend-spring` 的 `JwtInterceptor` 存在但未在 `WebConfig` 注册，目前只有显式带 `Authorization` 头的接口会校验。
3. `frontend-vue` 的部分字段（`jobTarget`、`salary`）与后端 `resume` 表字段未对齐，保存会丢字段。
4. 三个实现的数据库名与表结构并不统一，不能混跑。
5. `app-ts`、`frontend-vue` 在本机未跑通构建（网络/环境限制），提交的是源码。
6. 没有单元测试与接口测试。

## License

课程设计作品，仅供学习参考。
