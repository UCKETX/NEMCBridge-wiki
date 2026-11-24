---
title: 安装、更新与备份
description: 平台安装包选择、命令行启动参数、数据目录备份、SSH 远程管理、安全升级与重置管理员密码。
---

本页覆盖日常部署维护所需的安装参数、数据目录结构、远程管理、版本更新与备份恢复流程。

## 适用版本与前置条件

- **适用版本**：NEMCBridge `v1.6.0`（支持 Windows / Linux / macOS 的 `amd64` 与 `arm64`）。
- **前置条件**：
  - 对数据目录有读写权限。
  - 若在公网服务器部署，需提前配置防火墙，阻断外部直接访问 `18321` 端口。
  - 升级或迁移前，已做好**桥接数据目录**与 **BDS 世界存档**双份备份。

## 安装包选择与命令行参数

| 系统 | 发布包格式 | 常见架构选择 |
| --- | --- | --- |
| Windows | `NEMCBridge_<版本>_windows_<架构>.zip` | 多数 PC 选 `amd64`，ARM 设备选 `arm64` |
| Linux | `NEMCBridge_<版本>_linux_<架构>.tar.gz` | x86_64 服务器选 `amd64`，ARM64 服务器/树莓派选 `arm64` |
| macOS | `NEMCBridge_<版本>_macos_<架构>.tar.gz` | Apple Silicon（M 系列）选 `arm64`，Intel Mac 选 `amd64` |

常用启动参数（Windows 将 `./NEMCBridge` 替换为 `NEMCBridge.exe`）：

```sh
# 查看版本与全部参数
./NEMCBridge -version
./NEMCBridge -help

# 无头模式运行（不自动打开浏览器），指定数据目录与控制台端口
./NEMCBridge -headless -data-dir ./data -web-port 18321

# 无头启动并自动按已保存配置开房（默认启动不自动开房）
./NEMCBridge -headless -data-dir ./data -run

# 启动时开启 Debug 日志
./NEMCBridge -data-dir ./data -debug
```

完整公开配置示例见仓库的 [config.example.json](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/config.example.json)。

## 数据目录结构与备份

指定 `-data-dir ./data` 后，核心持久化文件都存放在该目录中：

| 文件或目录 | 用途 | 备份与安全注意事项 |
| --- | --- | --- |
| `config.json` | 国际服后端、房间、网关及控制台设置 | 升级与迁移时保留，不要用示例配置覆盖生产配置。 |
| `secrets.dat` | 机器人令牌存储 | **严禁上传或公开分享**。Windows 使用当前用户 DPAPI 加密，Linux/macOS 依赖 `0600` 文件权限；跨系统或跨用户迁移需重新填写令牌。 |
| `admin.json` | 管理员账号信息（bcrypt 哈希） | 可随目录备份；忘记密码时通过专用参数重置。 |
| `auth-trust/` | 已信任的 FGAuth 服务端公钥 | **升级或迁移时务必保留**；不要在未核实的情况下盲删。 |
| `account-profiles.json` | 缓存的账号公开资料（UID/昵称/头像） | 不含令牌，可重建。 |
| `cache/appearance/` | 按协议自动下载校验的兼容外观包缓存 | 保留可避免重复下载，必要时可清空重下。 |
| `logs/keeper.log` / `logs/status.json` | 完整运行日志与状态快照 | 排错提交前必须脱敏，详见 [常见故障与日志](../troubleshooting-and-logs/)。 |

### 备份操作步骤

1. 在控制台停止正在运行的房间，或先停止 NEMCBridge 进程。
2. 打包备份整个数据目录（如 `./data`）以及 BDS 的世界目录与权限文件。
3. 备份文件存放在非公开位置，确保不将 `secrets.dat` 纳入公开仓库或分享链接。

## 远程管理控制台

控制台默认监听 `0.0.0.0:18321` 且走明文 HTTP，不要直接对公网开放 `18321`。推荐在可信私网内访问，或使用 SSH 端口转发：

```sh
ssh -N -L 18321:127.0.0.1:18321 user@your-server
```

建立隧道后，在本机浏览器打开 `http://127.0.0.1:18321/` 即可安全操作远程控制台。

## 更新程序

### 方式一：控制台一键更新（推荐）

NEMCBridge 启动后及每 6 小时自动检查 GitHub 最新版本（可在「设置」关闭自动检查，仍支持点击顶栏版本号手动检查）。

1. 点击控制台顶栏版本号旁的「立即更新」。
2. 程序会自动下载对应平台包（GitHub 直连失败时自动回退内置加速镜像），校验 **SHA256 摘要**与项目 **Ed25519 发布签名**（绑定版本号、包名与 SHA256），试运行校验后替换可执行文件并重启。
3. 更新重启后，**更新前正在运行的国际服房间会自动重新启动**（房间号可能变化），控制台需要重新登录。

> 一键更新只安装带有效正式签名的发布包，不会推送预发布版本；自行编译的 `dev` 版本不启用自动更新。

### 方式二：手动更新与校验

1. 备份数据目录与 BDS 世界，停止旧版 NEMCBridge。
2. 从 [GitHub Releases](https://github.com/UCKETX/NEMCBridge/releases/latest) 下载对应平台包，并对照公开仓库 [release-metadata](https://github.com/UCKETX/NEMCBridge/tree/main/release-metadata) 中对应版本目录的 `.sha256` 文件核对哈希。
3. 解压覆盖可执行文件，**保留原数据目录**，重新启动程序。

## 重置管理员密码

忘记 Web 控制台管理员密码时：

1. 停止正在运行的 NEMCBridge 进程。
2. 使用**原有数据目录**执行重置命令：

```sh
./NEMCBridge -data-dir ./data -reset-admin-password
```

3. 启动程序后，使用终端新输出的一次性初始化码重新设置管理员用户名与密码。

## 成功标志

- 执行 `./NEMCBridge -version` 输出目标版本号（如 `v1.5.5`）。
- 重启后「国际服」与「网易账号」配置完整保留，无需重复录入（跨机/跨用户迁移令牌除外）。
- 远程部署时，外网无法直连 `18321`，通过 SSH 转发可正常登录控制台。

## 常见失败与排查

| 现象 | 原因与处理 |
| --- | --- |
| 迁移到新机器或切换 Windows 用户后令牌失效 | Windows 下 `secrets.dat` 绑定当前用户 DPAPI；迁移系统或账号后，在新环境控制台重新添加令牌即可。 |
| 升级后提示 FGAuth 公钥不匹配并拒绝连接 | 检查是否丢失了 `auth-trust/` 目录，或先通过可信渠道确认验证站是否更换了密钥，切勿盲删 `auth-trust/`。 |
| 一键更新下载慢或超时 | 程序在直连失败或速率低于约 25 KB/s 时会自动切换内置镜像并校验签名；若仍失败，改用手动下载并核对 `.sha256`。 |
| 升级前处于运行中的房间更新后房间号变了 | 属于正常行为，重开房间会分配新房间号，重新复制通知玩家即可。 |

---

**公开资料来源**：[README.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/README.md) · [docs/setup.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/docs/setup.md) · [CHANGELOG.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/CHANGELOG.md) · [旧 Wiki Operations](https://github.com/UCKETX/NEMCBridge/wiki/Operations)
