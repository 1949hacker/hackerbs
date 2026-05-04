---
title: DELL报错The PERC1 battery is low
date: '2025-09-04 14:56:26'
tags:
  - DELL
  - PERC
  - IT知识
  - 百科
  - BBU
  - 阵列卡
aliases:
  - DELL报错The-PERC1-battery-is-low
  - DELL报错The PERC1 battery is low
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/DELL报错The-PERC1-battery-is-low.md
---

> [!info] 知识位置
> 体系: 服务器硬件体系
> 层级: 排障
> 前置知识: [[datacentre/hardware/storage-interfaces|存储接口与硬盘形态]]
> 强关联: [[datacentre/storage/dell-disk-io-alert-troubleshooting|DELL服务器硬盘IO告警排障思路]]
> 原始来源: `source/_posts/DELL报错The-PERC1-battery-is-low.md`
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

## 关于DELL iDRAC日志中PERC报错问题的记录及解答

报错信息如下

> Sun Jul 06 2025 07:24:49	The PERC1 battery is operating normally.	
> Sun Jul 06 2025 06:50:13	The PERC1 battery is low.	
> Mon Apr 07 2025 04:22:23	The PERC1 battery is operating normally.	
> Mon Apr 07 2025 04:20:18	The PERC1 battery is low.

报错内容为PERC电量低，随后又恢复正常，错误复现周期为3个月



查询发现DELL官方文档有记录[《了解 PERC 电池错误》](https://www.dell.com/support/kbdoc/zh-cn/000351229/poweredge-%E4%BA%86%E8%A7%A3-perc-%E7%94%B5%E6%B1%A0%E9%94%99%E8%AF%AF#bat15)，其中《充电问题示例》中的报错疑似与该报错一致，但报错循环周期不同。

查询后了解到PERC是DELL阵列卡的电池，也就是俗称的RAID卡的BBU（Battery Backup Unit），而其中每三个月复现一次的该报错为DELL PERC的正常循环充放电操作，属于正常现象

## 总结

PERC每3个月重复报错`The PERC1 battery is low.	`随后恢复`The PERC1 battery is operating normally.	`

该报错为RAID卡BBU，电池的充放电报错，每3个月为周期的循环报错是DELL的自检行为，属于正常现象。

**2025-9-4已致电DELL800-858-0613核实，该信息可信**
