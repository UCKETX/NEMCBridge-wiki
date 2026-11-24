---
title: 版本与下载
description: NEMCBridge v1.5.5 下载与校验方法、关键版本变更脉络、旧 OP 管理与当前行为区分，以及公开资料冲突与待核清单。
---

本页汇总 `v1.5.5` 正式版下载与完整性校验方法、近期关键版本变化，以及交叉核对公开仓库、Release、旧 Wiki 与原文档站后整理的版本差异和待核项。

## 适用版本与下载地址

- **当前公开正式版基准**：`v1.5.5`（发布日期：`2026-11-23`）
- **官方下载页**：[GitHub Releases — v1.5.5](https://github.com/UCKETX/NEMCBridge/releases/tag/v1.5.5) · [所有历史版本](https://github.com/UCKETX/NEMCBridge/releases)
- **校验与签名目录**：[release-metadata/v1.5.5](https://github.com/UCKETX/NEMCBridge/tree/main/release-metadata/v1.5.5)（每个压缩包均附带对应的 `.sha256` 与 `.sig` 文件）

### 手动校验 SHA256 步骤

下载对应平台压缩包与 `.sha256` 文件后，在同目录核对哈希：

```sh
# Linux
sha256sum -c NEMCBridge_v1.5.5_linux_amd64.tar.gz.sha256

# macOS
shasum -a 256 -c NEMCBridge_v1.5.5_macos_arm64.tar.gz.sha256
```

```powershell
# Windows (PowerShell)
Get-FileHash .\NEMCBridge_v1.5.5_windows_amd64.zip -Algorithm SHA256
# 将输出与对应 .sha256 文件内容逐字符比对
```

校验一致后再按 [安装、更新与备份](/install-update-backup/#更新程序) 替换程序（或直接在控制台使用带 Ed25519 签名验证的一键更新）。

## 近期关键版本脉络

完整记录见公开仓库 [CHANGELOG.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/CHANGELOG.md)。服主升级时需重点关注以下节点：

| 版本 | 日期 | 核心变化与升级注意点 |
| --- | --- | --- |
| **`v1.5.5`**（当前基准） | 2026-11-23 | 修复重进时的区块缓存兼容断线及 Geyser 暂停菜单重复显示自己；访客昵称默认由桥接直查网易（无需验证服额外支持）；已开启 Beta 的房间默认启用轻量入口。明确不含单房选服。 |
| `v1.5.4` | 2026-11-23 | 普通房与转服统一使用大厅核验身份并沿用 `v1.5.1` 存档 UUID 算法；修复区块缓存、附魔台、转服后箱子和床。**OP 权限交回各国际服后端管理**，不再从桥接名单补发；注明 Windows BDS `26.60` 原生 OP 仅当次会话生效。 |
| `v1.5.3`（历史） | 2026-11-21 | 统一游戏内网易昵称显示；曾新增分服 OP 授权弹窗与托管 BDS 管道适配器（见下方历史区分）。 |
| `v1.5.2` | 2026-11-21 | 优化区块缓存以修复边界卡顿/前冲；修复附魔台提示「出错了」；后端授权绑定大厅认证 UID。 |
| `v1.5.1` | 2026-11-19 | 补齐普通房间网易原生 4D 装扮同步，提供国际版普通皮肤回退与可选 4D 模型包支持。 |
| `v1.5.0` | 2026-11-17 | 新增「突破10人限制（Beta）」公网固定 UDP `19441` 自动转服网关与开房前检测；多国际服共用单网关。 |
| `v1.4.1` | 2026-11-07 | Geyser 原版顺序方块表扩展至全部 11 档协议（`859–2225`）；新增 Nukkit `2168+` 兼容修复与 9 种服务端基础回归。 |
| `v1.4.0` | 2026-11-04 | 国际服扩展至 `1.21.120–26.60` 多版本转换；按协议自动下载、校验并缓存外观兼容包。 |
| `v1.3.0` | 2026-10-30 | 升级协议 `898` 与默认房间版本 `1.21.130.0`；一键更新引入 Ed25519 签名校验；控制台新装启用一次性初始化码。 |
| `v1.2.0` | 2026-10-25 | 多国际服、多账号、不设房间数量上限；支持免开房管理好友与发送私信。 |
| `v0.1.x`（早期） | 2026-10 | 早期单服/最多 8 房架构（`v0.1.6`）、内置经典材质预加载（`v0.1.7`）、控制台一键更新（`v0.1.8`）、安全协议 2 最低版本基线（`v0.1.9`）。 |

## 旧版行为与未发布功能区分

### 1. 旧 OP 管理文档（v1.5.3）vs 当前行为（v1.5.4 / v1.5.5）

- 公开仓库 `v1.5.5` 中仍保留着 [`docs/verified-bds.md`](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/docs/verified-bds.md)（介绍 `v1.5.3` 的分服 OP 授权弹窗与 `scripts/bds-console-ingress.py` 托管 BDS 管道适配器）。
- 但 [`v1.5.4` Release](https://github.com/UCKETX/NEMCBridge/releases/tag/v1.5.4) 与 `CHANGELOG.md` 明确写明：**「权限交回各国际服管理，不再从桥接名单补发 OP」**。
- **服主操作建议**：在 `v1.5.5` 中，请以**后端服务端自身权限机制**为准，不要按 `v1.5.3` 的托管管道文档重新改造 BDS，也不要按玩家昵称批量导入旧 OP 列表。

### 2. 未公开正式发布的功能

- **单房选服 / 选服大厅**：`v1.5.5` 更新日志明确写明「保留房间身份校验和固定 UDP 网关，**不含单房选服**」。在官方正式发布前，不作为正式版能力编写或承诺。
- **超过 9 位访客同时在线**：自动转服（Beta）仅验证了原版手机转服与名额释放，尚未完成超过 9 位访客同时在线的实测。

## 版本冲突与待核清单

交叉核对公开仓库（`v1.5.5`）、GitHub Releases、旧版 GitHub Wiki 与原文档站（`docs.html`）时，发现以下几处不一致或待进一步确认的事项，特此标明：

| 项目 | 公开资料差异 / 不确定点 | 当前文档处理方式 |
| --- | --- | --- |
| 原项目文档页 `docs.html` 版本滞后 | `site/docs.html` 仍展示 `v1.4.1` 下载区与更新日志，且登录说明仍写「用 `admin` 和终端显示的首次密码登录」（`v1.3.0+` 实际为一次性初始化码 + 自设管理员账号密码）。 | 本站统一按 **`v1.5.5`** 编写，并保留旧站链接仅作溯源参考。 |
| `docs/verified-bds.md` 与 `v1.5.4/v1.5.5` 的 OP 管理说明冲突 | `v1.5.5` 仓库仍保留 `v1.5.3` 时的托管 BDS OP 弹窗文档，而 `v1.5.4` 发行说明称 OP 交回后端管理。 | **待核**：`v1.5.5` 控制台界面是否已完全移除分服 OP 授权弹窗，或仍保留部分入口，需以 `v1.5.5` 实机界面核对；本站已优先遵循 `v1.5.4/v1.5.5` 发行说明。 |
| Windows BDS `26.60` 原生 OP 持久化 | `v1.5.4` 明确注明「本版不包含 26.60 OP 持久化修复」；`v1.5.5` 发行说明未再提及该项。 | **待核**：默认视为 `v1.5.5` 仍受 BDS `26.60` 离线空 XUID 影响，原生 OP 仅当次会话生效，建议在测试服实测确认。 |
| `CHANGELOG.md` 中的断链 | `v1.5.4` 条目链接到 `docs/releases/v1.5.4.md`，但该文件在 `v1.5.5` 标签仓库中不存在（返回 404）。 | 本站改链至可用的 [GitHub Releases `v1.5.4` 页面](https://github.com/UCKETX/NEMCBridge/releases/tag/v1.5.4)。 |
| FGAuth 最低配套版本表述略有差异 | `docs/setup.md` 写安全协议 2 要求 NEMCBridge `>= v0.1.9`、私信建议 FGAuth `>= v1.1.7`；`README.md` 写配套 FGAuth `v1.2.3+`；`v1.5.3` 写昵称核验需 FGAuth `v1.5.0+`（而 `v1.5.5` 改为默认直查网易）。 | 本站按功能分别标注，并建议部署最新兼容版 FGAuth。 |

---

**公开资料来源**：[CHANGELOG.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/CHANGELOG.md) · [GitHub Releases](https://github.com/UCKETX/NEMCBridge/releases) · [release-metadata/v1.5.5](https://github.com/UCKETX/NEMCBridge/tree/main/release-metadata/v1.5.5) · [docs/verified-bds.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/docs/verified-bds.md)
