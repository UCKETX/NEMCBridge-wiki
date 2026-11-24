---
title: 常见故障与日志
description: 按现象快速定位 NEMCBridge 开房、进服、转服、网络与材质问题，查看 Debug 日志并按规范脱敏反馈。
---

出现异常时，建议先对照下方故障表定位阶段，再开启临时 Debug 日志收集最小复现信息。

## 适用版本与前置条件

- **适用版本**：NEMCBridge `v1.5.5`。
- **排查原则**：遇到问题先做**对照实验**——用国际版直连后端排除服务端自身问题；开启了自动转服（Beta）的房间先关掉 Beta 测试普通房间，快速区分是网关问题还是桥接/后端问题。

## 按现象快速排查

| 故障现象 | 优先检查步骤 | 关联文档 |
| --- | --- | --- |
| 提示「客户端与房主版本不同」 | 分别核对三者：网易客户端（`3.10` 系列）、房间内核（保持 `1.21.130.0`）、国际服协议（11 档列表内）。不要把房间版本改成后端版本。 | [资源包与兼容性](/resource-packs-and-compatibility/#二bds-协议兼容表) |
| 机器人反复掉线并重开 | 1) 检查同一网易账号是否被手机或其他进程登录；2) 检查多房间是否误用同一账号；3) 检查 FGAuth 鉴权与网络状态。重开后房间号可能变化。 | [网易账号和开房](/accounts-and-rooms/#多账号与多房间配置步骤) |
| 能搜到房间，但进不了世界 | 1) 确认后端已运行且地址格式正确（RakNet 填 `主机:UDP端口`，NetherNet 填 `http://主机:信令端口` 并放通媒体 UDP）；2) 确认 `online-mode=false`、`compression-algorithm=zlib`、`block-network-ids-are-hashes=true`。 | [快速开始](/quick-start/#1-配置并重启-bds) |
| 开转服网关后停在第二段加载 | 1) 确认公网转发的是 **UDP** 而非 TCP/HTTP；2) 确认转发到桥接本机 `19441` 而非 BDS 或 `18321`；3) 用外网手机实测；4) 必要时临时设 `NEMCBRIDGE_LIGHTWEIGHT_ENTRY=0` 或关闭 Beta 隔离排查。 | [国际服与转服网关](/backends-and-gateway/#自动转服网关突破10人限制-beta) |
| 材质包下载完成但进游戏不生效 | 先用国际版直连核对 `world_resource_packs.json` 的 UUID、版本与依赖；更新包后是否提升了版本号并重开房间。 | [资源包与兼容性](/resource-packs-and-compatibility/#安装服务器自制材质包步骤) |
| 国际版看不到玩家皮肤或 4D 装扮 | 国际版关闭「仅允许受信任的皮肤」重进；区分普通皮肤与已适配 4D 模型，并非所有商城 4D 模型都支持跨端渲染。 | [资源包与兼容性](/resource-packs-and-compatibility/#4d-皮肤同步与边界v151) |
| macOS 开启 VPN 后卡在 `ICE Checking` | 先在无 VPN 的可信网络对照。确认物理网卡 UDP 可用时，可单次指定 `NEMCBRIDGE_ICE_INTERFACE=en0`（按实际网卡名替换）启动；该变量只绑定 WebRTC 接口，不修改系统路由。 | — |
| FGAuth 公钥变化，程序拒绝连接 | 通过可信渠道向验证站管理员核实公钥是否合法变更或迁移；**不要盲删 `auth-trust/`**。 | [网易账号和开房](/accounts-and-rooms/#fgauth-鉴权与信任机制) |
| 访客昵称直查异常 | `v1.5.5` 默认直查网易档案；排查阶段可临时设置 `NEMCBRIDGE_DIRECT_GUEST_LOOKUP=0` 重启，改由 FGAuth 核验做对照。 | [网易账号和开房](/accounts-and-rooms/#访客身份昵称核验与-op-权限v155-行为) |

## 查看日志与临时开启 Debug

### 日志位置与归类

- **控制台「运行日志」**：按国际服切换查看，同服内保留 `[房间 N]` 前缀。移除或替换账号后，内存中旧房间日志会被清空，但磁盘完整日志仍保留。
- **磁盘日志路径**：数据目录下的 `logs/keeper.log`（完整运行日志）与 `logs/status.json`（状态快照）。

### 开启与关闭 Debug 模式

默认日志只记录房间启停、玩家进出、公开聊天、死亡消息和必要错误。需要更多连接细节时：

1. 在控制台「运行日志」旁打开 **「Debug 模式」**（即时生效并保存，无需重开房间），或在启动命令加上 `-debug`。
2. 复现一次故障，记录带 `[DEBUG]` 前缀的关键阶段日志。
3. **复现完成后立即关闭 Debug 模式**，避免持续写入大量调试日志。

## 提交可复现反馈（脱敏检查清单）

无法自行解决时，请前往 [GitHub Issues](https://github.com/UCKETX/NEMCBridge/issues) 提交；若涉及安全漏洞，请按仓库的 [SECURITY.md](https://github.com/UCKETX/NEMCBridge/blob/main/SECURITY.md) 私密上报。

提交前请按顺序核对：

1. **必备环境信息**：
   - NEMCBridge 完整版本号（如 `v1.5.5`）及操作系统/架构。
   - 网易客户端版本、房间内核版本、后端服务端名称与完整版本号（如 `BDS 26.60.6` 或 `Geyser + Purpur` 版本）。
   - 是否开启了「突破10人限制（Beta）」、是否使用了自定义环境变量。
   - 故障发生的具体阶段、预期行为，以及普通桥接或国际版直连的对照结果。
2. **强制脱敏项（发送前务必删除或替换）**：
   - 机器人令牌（Token）、一次性初始化码、管理员密码。
   - 私有公网 IP、域名、内网穿透地址、房间密码及个人隐私信息。
   - **严禁上传 `secrets.dat` 或打包上传整个数据目录**。

## 成功标志

- 通过对照实验明确缩小了故障范围（后端 / 桥接 / 网关 / 材质）。
- 问题解决后已关闭 Debug 模式；若提交 Issue，所附日志片段已完成脱敏且包含完整版本号与复现阶段。

---

**公开资料来源**：[docs/setup.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/docs/setup.md) · [旧 Wiki Troubleshooting](https://github.com/UCKETX/NEMCBridge/wiki/Troubleshooting) · [SECURITY.md](https://github.com/UCKETX/NEMCBridge/blob/v1.5.5/SECURITY.md)
