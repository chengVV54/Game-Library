# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

----------------------------------------------------------------------------------------------------
## 阶段 1：打基础（1–2 周）

后端 API 统一封装：前端抽 api/ 层，用 .env 管理 VITE_API_URL
后端加输入校验、统一错误响应格式（{ code, message, data }）
引入 TypeScript 或 JSDoc，至少给 API 接口定类型
阶段 2：工程化（2–3 周）

加 Vitest + 1–2 个核心 API 测试
GitHub Actions：push 时跑 lint + test + build
ESLint + Prettier，统一代码风格
阶段 3：全栈能力（3–4 周）

用户系统：注册/登录（JWT），排行榜绑定真实用户
数据库：Java 后端接 PostgreSQL/MySQL，替代文件存分数
前后端联调：Swagger/OpenAPI 文档，约定接口契约
阶段 4：部署上线（1–2 周）

Docker 化前后端，docker-compose 一键启动
前端 Vercel/Netlify，后端 Railway/Render 或自建 VPS
配置 HTTPS、CORS、环境变量
阶段 5：进阶（可选）

实时对战：WebSocket
监控：Sentry 错误追踪
缓存：Redis 做排行榜
优先级建议

优先级	事项	原因
P0
环境变量 + API 封装
为部署和多环境打基础
P0
用户认证
全栈核心能力
P1
数据库持久化
替代文件存储
P1
基础测试 + CI
保证迭代不踩坑
P2
Docker + 部署
形成完整闭环
学习路径：先打通「前端 → API → 数据库 → 部署」一条链路，再逐步加认证、测试、监控。不必一次做完，按阶段推进即可。
---------------------------------------------------------------------------------------------------------
