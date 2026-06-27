# ZeroCom — 零佣金房产直连平台（Phase 1）

ZeroCom 是一个仅面向中国大陆的零佣金、点对点房产信息平台。**我们不收取任何交易佣金**，唯一的收入来自订阅费。

本项目是 Phase 1 的 MVP / 全栈网站实现，使用 Next.js 15（App Router）+ TypeScript + Tailwind CSS 构建。后端领域逻辑全部内含，并通过 **in-memory 存储 + 模拟适配器** 形成可运行的端到端产品流，同时保留与生产 Postgres / Prisma / 短信 / OCR / 支付 / 地图一致的接口。

## 快速开始

```bash
npm install
cp .env.example .env
npm run dev
```

打开 `http://localhost:3000` 进入产品。

> **数据持久化：** MVP 使用内存存储（服务重启后数据重置）。要切换到 Postgres，参照 `README.md` 底部的「生产接入」。

## 主要功能

- **手机 OTP 登录**（中国大陆手机号 `^1[3-9]\d{9}$`，6 位验证码、60s 冷却、3 次上限、5 分钟 TTL）。
- **买家 / 卖家 / 管理员三层角色**，其中卖家需完成 Tier-2 实名 + ID 核验才能发布房源。
- **房源 CRUD + 审核流**：草稿 → 审核中 → 已上架 → 已下架 / 成交 / 移除。
- **反爬反中介风控**：10 种 broker 信号、风险评分、自动建议处置（提醒 / 影子封禁 / 永久封禁 / 清理房源）。
- **付费订阅**：Free / 月度 Pro ¥29 / 年度 Pro ¥199，订阅通过 Alipay/WeChat Pay 模拟。
- **付费墙 + 直接联系**：Pro 用户先保存 / 发消息才能展示联系方式，附带 DirectMatch™ 认证。
- **举报 + 申诉流**：24 小时 SLA 打钩的后台队列。
- **订阅只能通过 webhook 成功路径授予**（见 `server/payments/index.ts` 的 `markPaidFromVerifiedWebhook`），UI 没有后门。

## 技术栈与架构

- `app/` — Next.js App Router 路由与RSC + 客户端组件）。
-— UI 系统 + 布局 / 房源 / 认证 / 卖家 / 支付 / 后台共享组件。
- `lib/` — 校验、工具函数、设计常量。
- `server/` — 领域服务（Auth、Entitlements、BrokerRisk、Audit、Payments）、Prisma 形态的 entity（`data/types.ts`）和 in-memory 存储（`data/store.ts`）。
- `prisma/schema.prisma` — 与生产 Postgres 对接的 Prisma schema（MVP 未连接，仅作形态参考）。
- `public/` — 占位 SVG 图片。
- `tests/` — 基于 Vitest 的核心业务规则单元测试。

## 目录结构（关键）

```text
app/
  page.tsx                             # landing
  auth/                                # /auth, /auth/verify
  onboarding/                          # /onboarding
  listings/                            # /listings, /listings/[id]
  pricing/                             # /pricing
  checkout/                            # /checkout
  payment/status/[orderId]             # /payment/status/:id
  dashboard/{saved,messages,subscription} # /dashboard/*
  seller/{,new,listings/[id]/edit,verification} # /seller/*
  admin/{listings,reports,broker-risk,appeals,payments,users/[id]} # /admin/*
  terms/ /privacy/ /refunds/           # legal
  api/                                 # 所有 REST routes
components/
  ui/                                  # 设计系统原语
  layout/                              # header/footer
  listings/                            # 房源卡片/筛选/详情/paywall
  auth/ seller/ payments/ admin/        # 业务组件
lib/                                   # 校验/工具/常量
server/
  auth.ts entitlements.ts broker-risk.ts audit.ts payments/
  data/{types.ts,store.ts,seed-data.ts}
  adapters/                            # sms/ocr/geo/phash 模拟
prisma/schema.prisma
```

## 模拟凭证 / Demo 旅程

> **开发模式 OTP**：在本地启动后，NON-production 环境中 `POST /api/auth/otp/send` 会返回 `devOtp` 字段，`components/auth/otp-form.tsx` 也会明显显示。默认 demo OTP：`123456`。

### Demo 账号（手机登录 — 服务器会发送 6 位测试码；本地开发模式显示在页面上）

| 角色 | 手机号 | 用户 ID |
|------|--------|---------|
| 免费买家 | `13800000001` | `user-free-buyer` |
| 月度 Pro 买家 | `13800000002` | `user-monthly-buyer` |
| 年度 Pro 买家 | `13800000003` | `user-annual-buyer` |
| Tier-2 认证卖家 | `13800000004` | `user-tier2-seller` |
| 疑似 broker（已被影子封禁） | `13800000005` | `user-shadow-banned` |
| 管理员 | `13800000006` | `user-admin` |
| 审核员 | `13800000007` | `user-moderator` |

输入手机号后点击「获取验证码」→ 查看页面上显示的 6 位数字 → 同意条款 → 登录 / 注册。

### 旅程 A — 免费买家 → 付费墙

1. 用 `13800000001` 登录 → 浏览房源列表。
2. 打开 **第 6 个房源详情**（5 个名额用完）→ 触发付费墙。

### 旅程 B — 订阅并显示联系方式

1. 在当前页面选择「月度 Pro」或「年度 Pro」。
2. 在结算页选择 Alipay / 微信支付 → 下单。
3. 在订单状态页点击橙色「模拟支付成功（仅开发模式）」。
4. 系统自动路由 `markPaidFromVerifiedWebhook()` → 激活订阅。
5. 返回已锁房源 → 「保存」或「发消息」→ 联系方式显示 + DirectMatch 徽章。

### 旅程 C — 卖家发布房源

1. 使用 `13800000004`（Tier-2 卖家）登录 → `/seller/new` 填表 → 提交。
2. 使用 `13800000006`（管理员）登录 → `/admin/listings` 审核通过。
3. 房源进入 feed。

### 旅程 D — Broker 检测

1. 种子已包含一个 `CRITICAL`（身份证复用）和一个 `HIGH` 信号（用户 `user-shadow-banned`）。
2. 管理员登录 `/admin/broker-risk` → 选择「永久封禁」→ 该用户的房源全部被移除，账号进入硬封禁。
3. 该用户仍能看到自己的房源，但其他用户看不到。

### 旅程 E — 举报 + 申诉

1. 买家使用 `/report` 举报某个房源 / 用户。
2. 管理员在 `/admin/reports` 处理。
3. 被惩罚用户使用 `/appeal` 提交申诉。
4. 管理员在 `/admin/appeals` 审批。

## 模拟适配器（可替换）

| 适配器 | 文件 | 说明 |
|--------|------|------|
| SMS OTP | `server/adapters/sms.ts` | 生产环境接入阿里云/腾讯云短信；本地仅 log + 返回 devOtp |
| ID OCR | `server/adapters/ocr.ts` | 生产环境使用百度 OCR / 腾讯 OCR / Face++ |
| Maps/Geo | `server/adapters/geo.ts` | 生产环境使用高德 / 百度地图 |
| Image pHash | `server/adapters/phash.ts` | 生产环境使用真实 pHash + 向量搜索 |
| Alipay / WeChat | `server/payments/adapters.ts` | 生产环境替换为官方 SDK，同样保持 adapter 接口 |

同时 `server/data/store.ts` 完全适配 Prisma，切换时只需把所有 `await store.xxx(...)` 改为 `await prisma.xxx(...)` —— 接口签名全部保留。

## 生产接入要点

1. **数据库**：安装 `prisma` + `@prisma/client`，`npm i -D prisma`，配置 `DATABASE_URL`，`npx prisma migrate dev`，并把 `server/data/store.ts` 中所有方法替换为 Prisma 调用。
2. **会话**：保留当前基于 cookie 的 session（`server/auth.ts`），或替换为 NextAuth；`requireAdmin` / `currentUser` 均以 `cookies()` 为基础，与具体实现解耦。
3. **SMS**：在 `server/adapters/sms.ts` 实现 `SmsProvider` 接口。
4. **OCR**：在 `server/adapters/ocr.ts` 实现 `OcrProvider` 接口。
5. **地图 / 地理编码**：在 `server/adapters/geo.ts` 实现 `GeoProvider` 接口。
6. **支付**：在 `server/payments/adapters.ts` 实现 `alipay` / `wechatpay` 适配器，保留 `verifyWebhook` → `markPaidFromVerifiedWebhook` 链路；`out_trade_no = userId_planCode_nonce` 的幂等逻辑已内置。
7. **Redis 配额与冷却**：当前内存 Map 仅在单实例有效；生产需替换为 Redis（OTP session / view counters / rate limit）。
8. **Captcha**：在 `app/listings` 入口中间件添加 Tencent Captcha / hCaptcha 校验。
9. **安全**：管理员 header（`x-user_id`）本 MVP 用简单比对；生产可改为 NextAuth `getServerSession()` + 数据库 role。
10. **Secrets**：RSA/HMAC 私钥应存放于 KMS/HSM，绝不能落盘在 `.env`。当前 `.env.example` 仅列占位符。

## 测试

```bash
npm test          # 运行 Vitest 核心业务规则测试
npm run test:watch
```

覆盖：手机号、OTP 规则、Asia/Shanghai 业务日计算、quota 命中、broker 评分与建议、外部联系方式识别。

## 环境变量（.env.example）

```
NODE_ENV=development
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-only-change-me-in-production"
SMS_PROVIDER=mock
OCR_PROVIDER=mock
GEOCODER_PROVIDER=mock
ALIPAY_MOCK=true
WECHOCK=true
```

## License

Proprietary — ZeroCom © 2026
