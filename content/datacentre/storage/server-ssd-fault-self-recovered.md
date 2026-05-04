---
title: '记录一次分析[服务器SSD报故障随后自行恢复正常现象]'
date: '2025-09-09 17:36:21'
tags:
  - Inspur
  - 浪潮
  - IT知识
  - 百科
  - 硬盘
  - 带外
  - BMC
aliases:
  - 记录一次分析-服务器SSD报故障随后自行恢复正常现象
  - '记录一次分析[服务器SSD报故障随后自行恢复正常现象]'
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/记录一次分析-服务器SSD报故障随后自行恢复正常现象.md
---

> [!info] 知识位置
> 体系: 存储与数据可靠性体系
> 层级: 案例
> 前置知识: [[datacentre/storage/smartctl-disk-troubleshooting-rma|关于服务器硬盘故障但带外没有错误日志的排障与报修笔记]]
> 强关联: [[datacentre/operations/server-stability-benchmark-methods|服务器稳定性及基准测试方法]]
> 原始来源: `source/_posts/记录一次分析-服务器SSD报故障随后自行恢复正常现象.md`
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

日常巡检时发现带外出现INTEL SSD故障告警，随后又自行恢复，间隔约30分钟，无人工介入。

`smartctl -a /dev/sda`

|故障原因推测|排障思路|
|---|---|
|硬盘背板接触问题|检查smartctl中`ID 199 UltraDMA CRC Error Count`的值，是否存在CRC校验错误|
|NAND闪存寿命是否不足|检查smartctl中`ID 233 Media Wearout Indicator`的值|
|是否存在坏扇区|检查smartctl中`ID 5 Reallocated sector ct`的值|
|硬盘备用空间是否不足|检查smartctl中`ID 232 Available Reservd space`的值|



实例：

```shell
Media Wearout Indicator: 当前值0 临界值100 - 健康
Reallocated Sector Count: 当前值0 临界值75 - 健康
Available Reservd Spare: 当前值0 临界值100 - 健康
```
