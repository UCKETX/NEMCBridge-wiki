# NEMCBridge 中文 Wiki

基于 [Astro Starlight](https://starlight.astro.build/) 构建的 NEMCBridge 中文静态文档站。支持 Markdown、侧栏与移动端抽屉导航、页内目录、深浅色切换，以及内置 [Pagefind](https://pagefind.app/) 站内中文全文搜索（无需外部搜索账号）。

- **当前文档基准版本**：公开正式版 `v1.5.5`
- **资料来源**：[UCKETX/NEMCBridge](https://github.com/UCKETX/NEMCBridge)、[GitHub Releases](https://github.com/UCKETX/NEMCBridge/releases)、[GitHub Wiki](https://github.com/UCKETX/NEMCBridge/wiki) 与原项目文档页

## 环境要求

- Node.js `>= 20`（当前开发验证环境为 Node.js `v23.10.0` / npm `10.9.2`）

## 安装与运行

```sh
# 1. 安装依赖（使用仓库锁文件）
npm ci

# 2. 启动本地开发服务（默认 http://localhost:28405/）
npm run dev

# 3. 生产构建（含 Pagefind 中文搜索索引生成）
npm run build

# 4. 本地预览生产构建产物（默认 http://localhost:28405/）
npm run preview
```

> 说明：Pagefind 全文搜索索引在 `npm run build` 阶段生成，验证站内搜索请使用 `npm run build && npm run preview`。

## 构建与校验脚本

```sh
# 检查 dist/ 内所有站内链接与页内锚点
npm run check:links

# 验证 Pagefind 搜索索引可命中「转服」「资源包」等中文词
npm run check:search

# 一键执行构建 + 链接检查 + 中文搜索验证
npm run verify
```

## 目录结构

```text
.
├── astro.config.mjs                 # Astro 与 Starlight 导航、语言配置
├── src/
│   ├── content.config.ts            # Starlight 文档集合定义
│   ├── styles/custom.css            # 简洁紫色强调主题与响应式表格/网格样式
│   └── content/docs/                # 中文 Markdown 文档页面
│       ├── index.md                 # 首页（按服主任务组织）
│       ├── quick-start.md           # 快速开始
│       ├── install-update-backup.md # 安装、更新与备份
│       ├── accounts-and-rooms.md    # 网易账号和开房
│       ├── backends-and-gateway.md  # 国际服与转服网关
│       ├── resource-packs-and-compatibility.md # 资源包与兼容性
│       ├── troubleshooting-and-logs.md         # 常见故障与日志
│       └── releases-and-downloads.md           # 版本与下载
├── scripts/
│   ├── check-links.mjs              # 站内链接与锚点校验
│   └── check-search.mjs             # Pagefind 中文分词检索校验
└── .github/workflows/ci.yml         # 最小 CI 构建校验（不含自动部署）
```

## 文档维护规范

1. **只依据公开信息**：新增或修订内容时，仅引用公开仓库、Release 说明与公开文档；**严禁提交私有运行日志、真实配置、私网/公网地址、账号令牌或凭据**。
2. **按服主任务组织**：每个操作页保持「适用版本与前置条件 → 操作步骤 → 成功标志 → 常见失败与排查」结构，避免不同页面大段重复，跨页通过站内链接引用。
3. **版本清晰标注**：
   - 随新正式版更新首页与各页基准版本号，并同步更新 `releases-and-downloads.md`。
   - 历史版本行为必须标注具体版本号（如 `v1.5.3` 与 `v1.5.4+` 的 OP 管理差异）。
   - 未公开正式发布的功能不写入正式版能力；不确定项标注「待核」。
4. **提交前校验**：每次改动后执行 `npm run verify`，确认构建、站内链接和中文搜索全部通过。
