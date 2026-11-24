---
title: 快速开始
description: 在同机 Bedrock Dedicated Server 上跑通第一个 NEMCBridge 普通房间的最短路径。
---

先在同一台机器上跑通「1 台 BDS + 1 个普通房间」，确认网易端和国际版都能进入同一个世界，再考虑多房间、跨版本或公网转服网关。

## 适用版本与前置条件

- **适用版本**：NEMCBridge `v1.6.0`（网易客户端基线 `3.10.5.301327`，房间内核 `1.21.130.0`，游戏协议 `898`）。
- **推荐起步后端**：官方 BDS `1.21.130.4`（协议 `898`）。如果你使用 `26.x`、`NetherNet` 或 `Geyser`，先查看 [资源包与兼容性](../resource-packs-and-compatibility/) 与 [国际服与转服网关](../backends-and-gateway/)。
- **必备资源**：
  1. 可正常启动的 Bedrock 服务器及世界存档（自行准备）。
  2. 一个独立的网易机器人账号，以及对应验证站签发的 FGAuth 机器人令牌（项目不分发账号或令牌）。
  3. 网络可访问所选 FGAuth 验证服务器、网易房间节点及本机/后端 Bedrock 端口。

## 操作步骤

### 1. 配置并重启 BDS

打开 BDS 目录下的 `server.properties`，确保包含以下三项后重启 BDS：

```properties
online-mode=false
compression-algorithm=zlib
block-network-ids-are-hashes=true
```

> **安全边界**：关闭 `online-mode` 后，玩家名、UUID 和 XUID 不再代表经过 Xbox 正版认证的身份。务必通过防火墙限制 BDS 端口访问范围，不要仅凭玩家昵称赋予管理权限。

### 2. 下载并启动 NEMCBridge

从 [GitHub Releases](https://github.com/UCKETX/NEMCBridge/releases/latest) 下载对应系统与架构的压缩包（常见 Windows PC / x86 Linux 选 `amd64`，Apple Silicon / ARM 服务器选 `arm64`）。

- **Windows**：解压 `windows_*.zip`，双击 `NEMCBridge.exe`（或在 PowerShell 执行 `.\NEMCBridge.exe -data-dir .\data`）。
- **Linux / macOS**：

```sh
tar -xzf NEMCBridge_*_linux_amd64.tar.gz
cd NEMCBridge_*_linux_amd64
chmod +x NEMCBridge
./NEMCBridge -data-dir ./data
```

启动后终端会输出当前版本、控制台访问地址以及首次登录所需的**一次性初始化码**。

### 3. 初始化控制台

1. 本机浏览器打开 `http://127.0.0.1:18321/`（同局域网设备可使用终端显示的局域网地址）。
2. 输入终端显示的**一次性初始化码**（本机自动弹出浏览器时通常会自动填入），设置管理员用户名与密码。
3. 控制台默认监听 `0.0.0.0:18321` 且使用明文 HTTP，**不要将 `18321` 端口暴露到公网**。远程管理请使用 SSH 端口转发，详见 [安装、更新与备份](../install-update-backup/#远程管理控制台)。

### 4. 填入配置并开房

在 Web 控制台按顺序完成四步：

1. **设置**：填写可信的 FGAuth 验证服务器地址（默认 `https://fgauth.ucket.top`）。令牌会发送到你填写的验证站，请只填写自己信任的服务。
2. **国际服**：点击「添加国际服」，同机 RakNet BDS 填写 `127.0.0.1:19132`（NetherNet 后端需填写 `http://主机:信令端口`，详见 [后端地址格式](../backends-and-gateway/#后端地址与传输协议)）。
3. **网易账号**：添加机器人令牌；随后切到 **桥接** 页面，将该账号绑定到刚添加的国际服。
4. **概览**：选择目标国际服，点击「启动房间」，等待状态就绪后复制房间号。

> 程序启动本身**不会自动开房**（旧版 `auto_start` 配置已不再生效），每次冷启动后需在概览手动开房，或使用命令行参数 `-run`。

### 5. 邀请双端玩家进入

- **网易版玩家**：在「本地联机」搜索控制台显示的房间号加入。
- **国际版 Bedrock 玩家**：直接通过服务器 IP 与 UDP 端口连接同一台 BDS。国际版直连玩家不占用网易房间名额，但计入 BDS 的 `max-players`。

## 成功标志

完成以下四项检查即说明基础链路已跑通：

- 控制台「概览」中房间状态稳定在线，并显示可复制的房间号。
- 网易端与国际版玩家能同时进入同一个世界，并互相看到对方角色。
- 双端可以收发中文聊天消息。
- 双方均能正常破坏和放置方块，退出重进后背包位置与方块状态保留。

## 常见失败与排查

| 现象 | 优先检查项 |
| --- | --- |
| 网易端提示「客户端与房主版本不同」 | 核对网易客户端是否为 `3.10` 系列、房间内核保持 `1.21.130.0`，不要把房间版本改成 BDS 版本。 |
| 能搜到房间，但卡在加载或无法进入世界 | 确认 BDS 已启动且 `server.properties` 三项配置已生效；核对「国际服」地址与端口是否指向真正的 Bedrock 入口。 |
| 首次打开控制台提示需要初始化码 | 查看启动终端输出的一次性初始化码；若忘记已设置的管理员密码，按 [重置管理员密码](../install-update-backup/#重置管理员密码) 处理。 |
| 机器人反复掉线或刚开房就被踢 | 检查同一网易账号是否在手机或其他程序同时登录；多房间不能共用同一账号。 |

更多故障定位见 [常见故障与日志](../troubleshooting-and-logs/)。

---

**公开资料来源**：[README.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/README.md) · [docs/setup.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/docs/setup.md) · [旧 Wiki Quick-Start](https://github.com/UCKETX/NEMCBridge/wiki/Quick-Start)
