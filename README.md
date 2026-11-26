# NEMCBridge 官网与中文 Wiki

基于 [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) 构建的单仓库、一次静态构建、同域名站点：

- `/`：NEMCBridge 官网首页（能力概览、首次配置顺序、官方 Releases 下载入口、自绘连接架构图）
- `/wiki/`：Starlight 中文运维与使用文档（侧栏与移动端抽屉导航、页内目录、深色主题、内置 [Pagefind](https://pagefind.app/) 中文全文搜索，无需外部搜索账号）
- 旧路径兼容跳转：保留 `/docs.html`、`/docs/`、原根路径文档（如 `/quick-start/`）及旧 GitHub Wiki 路径（如 `/Transfer-Gateway/`、`/Compatibility/`、`/wiki/Operations/`）的静态跳转与锚点映射

- **当前文档基准版本**：公开正式版 `v1.5.5`
- **资料来源**：[UCKETX/NEMCBridge](https://github.com/UCKETX/NEMCBridge)、[GitHub Releases](https://github.com/UCKETX/NEMCBridge/releases)、[GitHub Wiki](https://github.com/UCKETX/NEMCBridge/wiki) 与原项目文档页

## 站点地址

- [NEMCBridge 官网](https://nemcbridge.ucket.top/)
- [NEMCBridge 中文 Wiki](https://nemcbridge.ucket.top/wiki/)

推送到 `main` 后，GitHub Actions 构建、校验并将官网与文档一起部署到 GitHub Pages。发布流程从 Pages 配置读取站点地址与子路径；本地开发仍从 `/` 开始。

## 环境要求

- Node.js `22.23.4+`（CI 使用 22.x）

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
├── public/
│   ├── favicon.svg                  # 站点图标（与原官网相同的像素图标）
│   ├── site/                        # 官网样式、脚本与插画（沿用原官网 site/ 的设计，内容按 v1.5.5 更新）
│   └── docs.html                    # 旧 /docs.html 入口跳转（含锚点映射）
├── src/
│   ├── content.config.ts            # Starlight 文档集合定义
│   ├── components/
│   │   ├── Header.astro             # Wiki 顶栏（与官网导航一致：首页/文档/搜索/QQ 群/GitHub/下载）
│   │   ├── StarlightSiteTitle.astro # Wiki 品牌（同官网像素图标，点击回官网）
│   │   ├── Footer.astro             # 上一页/下一页 + 与官网一致的站点页脚
│   │   ├── ThemeProvider.astro      # 文档固定深色（与官网一致）
│   │   └── MobileMenuFooter.astro   # 窄屏抽屉底部（QQ 群 / GitHub / 下载）
│   ├── pages/
│   │   ├── index.astro              # 官网首页（/）
│   │   └── [...legacy].astro        # 旧文档与旧 GitHub Wiki 路径跳转
│   ├── styles/custom.css            # Wiki 简洁紫色强调主题与响应式样式
│   └── content/docs/wiki/           # 中文 Markdown 文档页面（/wiki/*）
│       ├── index.md                 # 文档首页（按服主任务组织）
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
└── .github/workflows/              # ci.yml 校验；pages.yml 发布到 GitHub Pages
```

## 文档维护规范

1. **只依据公开信息**：新增或修订内容时，仅引用公开仓库、Release 说明与公开文档；**严禁提交私有运行日志、真实配置、私网/公网地址、账号令牌或凭据**。
2. **按服主任务组织**：每个操作页保持「适用版本与前置条件 → 操作步骤 → 成功标志 → 常见失败与排查」结构，避免不同页面大段重复，跨页通过站内链接引用。
3. **版本清晰标注**：
   - 随新正式版更新首页与各页基准版本号，并同步更新 `releases-and-downloads.md`。
   - 历史版本行为必须标注具体版本号（如 `v1.5.3` 与 `v1.5.4+` 的 OP 管理差异）。
   - 未公开正式发布的功能不写入正式版能力；不确定项标注「待核」。
4. **提交前校验**：每次改动后执行 `npm run verify`，确认构建、站内链接和中文搜索全部通过。
