---
title: 国际服与转服网关
description: 国际服后端 RakNet / NetherNet 地址格式，以及「突破10人限制（Beta）」公网 UDP 转服网关与轻量入口配置。
---

本页说明如何在 NEMCBridge 中填写不同传输协议的国际服后端地址，以及如何配置「突破10人限制（Beta）」公网 UDP 自动转服网关来释放网易大厅名额。

## 适用版本与前置条件

- **适用版本**：NEMCBridge `v1.6.0`（公网转服网关自 `v1.5.0` 引入，轻量入口自 `v1.5.5` 起在启用 Beta 的房间默认开启）。
- **前置条件**：
  - 已经按 [快速开始](../quick-start/) 跑通普通桥接房间，确认后端本身可稳定进入。
  - 若启用自动转服（Beta），需要一条**支持 UDP** 的公网端口映射或内网穿透（如端口转发、支持 UDP 的 FRP 隧道）；**HTTP / TCP 隧道无法替代 UDP**。
  - 准备一台**外网环境**的网易手机客户端用于实际验证（避免受本机 NAT 回环干扰）。

## 后端地址与传输协议

在控制台「国际服」添加或编辑后端时，「Bedrock 地址」必须指向**真实游戏后端**，不能填成公网转服网关地址。

| 后端传输 | 「Bedrock 地址」格式 | 网络与配置要求 |
| --- | --- | --- |
| RakNet | `主机:UDP端口`（如 `127.0.0.1:19132`） | 桥接能访问后端 Bedrock 游戏 UDP 端口。官方 BDS `26.30 / 26.40 / 26.45` 及更早版本按 RakNet 验证。 |
| NetherNet | `http://主机:信令端口`（仅配置有效 TLS 时用 `https://`） | 桥接须同时能访问 HTTP 信令端口与后端 `server-udp-ports` 配置的 UDP 媒体端口。较新的 BDS `26.50 / 26.60` 组合需设置 `transport=nethernet` 并按 NetherNet 接入。 |

> 不要把更早版本的 NetherNet 信令格式视为已支持。填写 Geyser 后端时，同样填写 Geyser 的 **Bedrock 入口**，不要填写 Java TCP 端口。

## 自动转服网关（突破10人限制 Beta）

普通桥接模式下，网易访客整个游玩过程都会持续占用网易房间的一个大厅名额。启用自动转服（Beta）后：

1. 玩家仍使用原版网易客户端搜索房间号进房，无需安装插件或手动输入服务器地址。
2. 进房后，NEMCBridge 自动将玩家转服到你配置的**公网 UDP 网关**，完成交接后释放网易大厅名额（玩家端通常会看到两段加载画面）。
3. **v1.5.5 轻量入口（默认开启）**：已开启 Beta 的房间默认使用本机轻量入口——首段不登录实际后端，等客户端自动转服到公网网关后再连接实际服务器，无需额外设置。若排查兼容问题需临时恢复旧入口，可设置环境变量 `NEMCBRIDGE_LIGHTWEIGHT_ENTRY=0` 并重启（网关和身份交接仍保留）。

### 配置步骤

1. **映射本机 UDP 端口**：将 NEMCBridge 所在机器的 **`UDP 19441`** 映射到公网（或建立一条 UDP 内网穿透隧道）。多个国际服与多个房间共用这一个固定端口。
   - 穿透客户端与 NEMCBridge 在同一台机器时，转发目标填 `127.0.0.1:19441`。
   - 穿透客户端在容器或另一台机器时，须确保其能访问 NEMCBridge 监听地址；若来源网段未被自动识别为可信网段，可在高级配置 `handoff.allowed_networks` 明确填写实际可信来源网段，**严禁填写 `/0`**。
   - 如需更换本机监听端口，可通过高级配置 `handoff.listen_port` 覆盖 `19441`。
2. **填写全局公网网关**：先停止所有正在运行的房间，在控制台「国际服 → 公网网关」填写 `公网域名或IP:公网端口`（例如 `gateway.example.com:24185`）。
3. **为目标国际服开启 Beta**：编辑目标国际服（修改单服前只需停止该服），打开 **「突破10人限制（Beta）」** 开关；「Bedrock 地址」继续保留真实后端地址。
4. **查看开房前检测并外网实测**：启动房间时查看网关检测结果。端口冲突、映射错误必须先修复；若仅因路由器不支持 NAT 回环导致本机探测失败，请直接用外网手机实测确认。

### 三类地址对照表

| 地址类型 | 示例 | 填写位置 / 用途 |
| --- | --- | --- |
| 本机网关监听端口 | `127.0.0.1:19441`（UDP） | 同机内网穿透客户端的本地转发目标 |
| 公网 UDP 网关 | `gateway.example.com:24185` | 控制台「国际服 → 公网网关」，供网易玩家转服连接 |
| 真实 Bedrock 后端 | `127.0.0.1:19132` 或 `http://127.0.0.1:19453` | 国际服的「Bedrock 地址」，由 NEMCBridge 后端连接 |

> **安全边界**：只穿透游戏转服 UDP 端口（默认 `19441`），**绝不要穿透 `18321` 管理控制台**。

## 选服大厅

从 `v1.6.0` 起，一个网易房间可以连接多个国际服。玩家搜索同一个房号进房，在游戏内选择目标后自动转服。它不会合并各后端的存档或权限。

1. 在「国际服」添加各个目标服务器，先设置**全局公网 UDP 网关**。
2. 在「国际服 → 选服大厅」点击「新建大厅」，输入名称后保存。展开大厅卡片，添加、移除和排序目标服；列表顺序就是游戏内顺序。
3. 到「桥接」把网易账号绑定到该大厅。大厅至少需要 **2 个、最多 8 个**目标。使用中的大厅先停房，再改成员或顺序。一个大厅可供多个房间绑定。
4. 在「概览」从左侧房间启动。这里会显示房间指向大厅及其目标服；不使用大厅的房间仍可直连单服。

选服大厅自己使用转服网关，目标服**无需单独打开**「突破 10 人限制（Beta）」。确认在线的目标显示绿色粗体；离线目标显示红色粗体和「离线」，选中不会转服；尚未探测的目标保持默认样式。取消或等待超时退出入口，不会自动进入默认服。

## 玩家真实 IP 透传与 PROXY Protocol v2

NEMCBridge 运行在本机或内网时，后端默认看到的底层 UDP 源地址是 `127.0.0.1` 或桥接主机 IP。自 `v1.6.1` 起，当 WebRTC 建立直连（`host` / `srflx` / `prflx` 候选）或玩家直连公网 UDP 网关时，NEMCBridge 自动通过多种方式向后端提供真实对端地址：

### 1. 默认自动透传（无需配置，全后端通用）

1. **登录 `ClientData` 字段**：向后端发送的 `Login` `ClientData` JWT 自动写入 `ClientIP`（字符串，如 `"203.0.113.42"`）与 `ClientPort`（端口整数），并先清除客户端可能自带的同名字段防止伪造，覆盖协议 `859–2225`。
2. **结构化 JSON 文件**：在登录包发往后端前，原子写入数据目录下的 `logs/player_ips.json`（权限 `0600`），格式为 `{玩家名: {ip, port, time, uid, uuid, xuid, source, server, online}}`；后端插件在登录事件中即可直接读取，无竞态。
3. **运行日志**：在 `logs/keeper.log` 与控制台日志记录 `玩家 <名称> 来自 <IP>:<端口>`。

### 2. UDP HAProxy PROXY Protocol v2（按国际服可选开启）

如果后端原生支持 UDP 代理协议（例如 **Geyser**、**WaterdogPE** 或支持 PPv2 的 **Nukkit-MOT**），可在控制台「国际服 → 编辑」勾选 **PROXY Protocol v2（透传真实 IP）**（配置项 `proxy_protocol: true`，修改前需先停掉使用该服的房间），让后端日志和现有插件（如 `/ban-ip`、AuthMe、LiteBans）**无需修改插件代码**直接读取真实 IP。

以 **Geyser-Spigot（Paper / Purpur）** 为例，修改 `plugins/Geyser-Spigot/config.yml`：

```yaml
advanced:
  java:
    # Geyser-Spigot 插件版同进程直连（use-direct-connection: true）时必须保持 false！
    use-haproxy-protocol: false
    use-direct-connection: true
  bedrock:
    use-haproxy-protocol: true
    # 填写 NEMCBridge 所在主机 IP 或网段，防止伪造 PROXY 头并避免同源触发 RakNet 限流
    haproxy-protocol-whitelisted-ips:
      - "127.0.0.1"
      - "192.168.31.102"
```

保存后在服务端执行 `/geyser reload` 或重启即可生效。

### 各服务端适用方式对照

| 服务端 | PROXY Protocol v2 开关 | 推荐获取方式 |
| --- | --- | --- |
| **Geyser（Paper / Purpur 等）** | 支持（建议按需开启） | 开启 `proxy_protocol` + Geyser `advanced.bedrock.use-haproxy-protocol: true` |
| **WaterdogPE / 支持 PPv2 的 Nukkit-MOT** | 支持 | 开启 `proxy_protocol` 并同步启用后端 PPv2 |
| **原版 BDS** | **不支持（请勿开启）** | 外置脚本／面板读取 `logs/player_ips.json` 或 `logs/keeper.log` |
| **LeviLamina / Endstone / PMMP / PNX / Nukkit / Allay / Dragonfly** | 原生不支持 | 插件读取登录 `ClientData` 的 `ClientIP` / `ClientPort`（或 `logs/player_ips.json`） |

### 安全与网络边界

- **不支持 NetherNet 地址**：`proxy_protocol` 仅支持 UDP/RakNet 后端，不能与 `http://`（BDS 26.60 NetherNet）同时开启。
- **Geyser 同端口直连限制**：Geyser 开启 `advanced.bedrock.use-haproxy-protocol: true` 后，该 UDP 端口只接收带 PROXY 头的连接，未经代理直连该端口的国际版客户端会被丢弃。
- **跨协议族支持**：IPv6 玩家连入 IPv4 后端时，PROXY Protocol v2 自动按 `UDP6`（目标为 IPv4 映射地址）编码。
- **自动转服与 FRP 穿透**：若公网 UDP 网关收到的是回环或内网穿透地址（如 `127.0.0.1`），会自动回退保留入口阶段 WebRTC 获取的玩家真实地址。
- **远程 TURN 中继保护**：若玩家经远程 TURN 中继建连，NEMCBridge **不会**把 TURN 服务器 IP 或未经传输验证的信令候选当作 `ClientIP`，避免 IPBan 误封中继节点；此时 `ClientData` 不含 `ClientIP`，`logs/player_ips.json` 中 `ip` 为空且 `source` 为 `"webrtc-relay"`。

## 限制与回退

- **尚未实测超过 9 位访客同时在线**：原版网易手机的自动转服与大厅名额释放已验证，但公开版本**尚未完成超过 9 位访客同时在线的实测，不承诺无限人数**。默认每房间 `128` 个交接/在线会话仅是保护上限，不是实测容量；实际承载力取决于后端、带宽和机器性能。
- **关闭与回退**：停止目标国际服后，关闭单服的 Beta 开关并重新开房，即可恢复普通桥接。清空全局「公网网关」会同时关闭所有国际服的 Beta 开关。

## 成功标志

用一台**外网网络**的网易手机测试，同时满足以下三点即配置成功：

- 能通过房间号正常进入，并自动完成转服进入目标世界（看到两段加载属正常现象）。
- 进入世界后，大厅名额已释放，原有箱子、床、方块实体与背包数据正常可读。
- 停止其中一个房间时，其他共用同一公网网关的房间不受影响。

## 常见失败与排查

| 现象 | 优先检查项 |
| --- | --- |
| 控制台里 Beta 开关是灰色的无法打开 | 尚未在「国际服 → 公网网关」填写全局公网入口，或目标国际服仍在运行（修改前须先停止）。 |
| 转服后卡在第二段加载界面 | 1) 确认公网隧道/转发是 **UDP** 而非 TCP/HTTP；2) 确认转发目标指向桥接的 `19441`（或自定义 `handoff.listen_port`），而非 BDS 或 `18321`；3) 换外网手机实测，排除 NAT 回环；4) 可先关闭 Beta 测试普通房间是否正常，以隔离问题。 |
| 开启 Beta 后进服行为异常，怀疑与轻量入口有关 | 临时在启动环境中设置 `NEMCBRIDGE_LIGHTWEIGHT_ENTRY=0` 重启对照，确认差异后反馈日志。 |
| 跨机或容器部署穿透后网关拒收连接 | 检查容器网络是否可达桥接监听地址，并在 `handoff.allowed_networks` 仅添加穿透端的实际可信来源网段。 |

---

**公开资料来源**：[docs/handoff.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/docs/handoff.md) · [CHANGELOG.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/CHANGELOG.md) · [v1.5.5 Release](https://github.com/UCKETX/NEMCBridge/releases/tag/v1.5.5) · [旧 Wiki Transfer-Gateway](https://github.com/UCKETX/NEMCBridge/wiki/Transfer-Gateway)
