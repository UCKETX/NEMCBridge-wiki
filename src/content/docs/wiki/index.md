---
title: NEMCBridge 中文文档
description: 面向服主的 NEMCBridge 中文操作手册，以公开正式版 v1.5.5 为基准，按运维任务组织。
tableOfContents: false
prev: false
next:
  link: ./quick-start/
  label: 快速开始
---

NEMCBridge 通过 FGAuth 登录房主机器人，创建网易《我的世界》「本地联机」房间，并将玩家连接转发到你已有的 Bedrock 服务器（BDS、Geyser 等），让网易端玩家与国际版 Bedrock 玩家进入同一个世界。程序本身不提供游戏服务端、地图存档或机器人账号。

> **当前文档基准：公开正式版 `v1.5.5`（2026-11-23）**。历史版本行为会标注具体版本号；尚未公开正式发布的功能（如单房选服 / 选服大厅）不作为正式版能力编写。

<div class="nb-cta-row">
  <a class="nb-cta nb-cta-primary" href="./quick-start/">从快速开始入手 →</a>
  <a class="nb-cta" href="../#download">下载 v1.5.5</a>
</div>

## 按任务查找文档

<ul class="task-grid">
  <li>
    <a class="task-card" href="./quick-start/">
      <em>01</em>
      <strong>快速开始</strong>
      <span>同机 BDS 配置、下载启动、控制台初始化并跑通第一个互通房间。</span>
    </a>
  </li>
  <li>
    <a class="task-card" href="./install-update-backup/">
      <em>02</em>
      <strong>安装、更新与备份</strong>
      <span>平台包选择、命令行参数、数据目录备份、SSH 远程管理、一键更新与密码重置。</span>
    </a>
  </li>
  <li>
    <a class="task-card" href="./accounts-and-rooms/">
      <em>03</em>
      <strong>网易账号和开房</strong>
      <span>FGAuth 鉴权、多账号与多房间、人数上限、好友申请与私信、身份及 OP 权限说明。</span>
    </a>
  </li>
  <li>
    <a class="task-card" href="./backends-and-gateway/">
      <em>04</em>
      <strong>国际服与转服网关</strong>
      <span>RakNet / NetherNet 后端地址写法、「突破10人限制（Beta）」公网 UDP 网关与轻量入口配置。</span>
    </a>
  </li>
  <li>
    <a class="task-card" href="./resource-packs-and-compatibility/">
      <em>05</em>
      <strong>资源包与兼容性</strong>
      <span>自动外观兼容包、服务器自制材质、4D 皮肤、11 档 BDS 协议表及 Geyser 等服务端范围。</span>
    </a>
  </li>
  <li>
    <a class="task-card" href="./troubleshooting-and-logs/">
      <em>06</em>
      <strong>常见故障与日志</strong>
      <span>按故障现象快速排查、Debug 日志开关、日志文件位置与脱敏反馈清单。</span>
    </a>
  </li>
  <li>
    <a class="task-card" href="./releases-and-downloads/">
      <em>07</em>
      <strong>版本与下载</strong>
      <span>v1.5.5 下载与 SHA256 / Ed25519 校验、版本变更脉络、旧文档冲突与待核清单。</span>
    </a>
  </li>
</ul>

## 首次部署建议顺序

1. 先按 [快速开始](./quick-start/) 在同一台机器跑通「官方 BDS `1.21.130.4` + 1 个普通房间」，确认网易端和国际版都能进服、聊天、挖放方块。
2. 需要多开房间或管理好友时，阅读 [网易账号和开房](./accounts-and-rooms/)。
3. 需要跨版本后端、Geyser 或材质包时，对照 [资源包与兼容性](./resource-packs-and-compatibility/) 确认版本与限制。
4. 需要释放网易大厅 10 人名额时，再按 [国际服与转服网关](./backends-and-gateway/) 配置公网 UDP 网关。
5. 上线前按 [安装、更新与备份](./install-update-backup/) 锁定防火墙端口（禁止把 `18321` 控制台暴露公网）并做好数据目录与世界备份。

## 公开资料出处

本站内容交叉核对自以下公开仓库与发布信息：

- 公开仓库与文档：[github.com/UCKETX/NEMCBridge](https://github.com/UCKETX/NEMCBridge)（基准标签 `v1.5.5`）
- 公开 Release 列表：[GitHub Releases](https://github.com/UCKETX/NEMCBridge/releases)
- 旧版 GitHub Wiki：[NEMCBridge Wiki](https://github.com/UCKETX/NEMCBridge/wiki)
- 原项目文档页：[ucketx.github.io/NEMCBridge/docs.html](https://ucketx.github.io/NEMCBridge/docs.html)（注：部分内容停留在 `v1.4.1`，与 `v1.5.5` 的差异见 [版本与下载](./releases-and-downloads/)）
