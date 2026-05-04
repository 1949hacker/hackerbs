---
title: 关于DELL PowerEdge报错Correctable memory error logging disabled for a memory device的说明
date: '2025-09-04 16:16:54'
tags:
  - DELL
  - ECC
  - IT知识
  - 百科
  - 内存
  - iDRAC
aliases:
  - 关于DELL-PowerEdge报错Correctable-memory-error-logging-disabled-for-a-memory-device的说明
  - 关于DELL PowerEdge报错Correctable memory error logging disabled for a memory device的说明
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/关于DELL-PowerEdge报错Correctable-memory-error-logging-disabled-for-a-memory-device的说明.md
---
> [!info] 知识关系
> 所属体系: [[datacentre/_index|数据中心与基础设施]] / [[datacentre/hardware/_index|服务器硬件体系]]
> 主题节点: 关于DELL PowerEdge报错Correctable memory error logging disabled for a memory device的说明
> 推荐前置: [[fundamentals/it-basics-encyclopedia|IT基础知识百科]]
> 相关主题: [[datacentre/hardware/dell-perc-battery-low|DELL报错The PERC1 battery is low]] / [[datacentre/operations/server-stability-benchmark-methods|服务器稳定性及基准测试方法]]
> 原始来源: `source/_posts/关于DELL-PowerEdge报错Correctable-memory-error-logging-disabled-for-a-memory-device的说明.md`
> 从旧博客迁移；已按知识图谱结构重新归档。

---

## 关于DELL PowerEdge R740XD iDRAC报内存设备的可纠正内存错误日志记录已禁用问题的说明及解答

> 巡检发现：iDRAC报错Correctable memory error logging disabled for a memory

致电800-858-0613核实BIOS固件版本低于2.10，固件过旧，属于遗留问题

关于该报错的解释为：BIOS关闭了对于ECC纠错记录的保存，仅仅是没有记录进行了ECC纠错，实际上并不影响使用，可能存在的风险为：无法知晓ECC进行了多少次纠错。

**2025-9-4已致电DELL800-858-0613核实，该信息可信**
