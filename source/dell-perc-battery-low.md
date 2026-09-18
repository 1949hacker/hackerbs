巡检 DELL 服务器时，iDRAC 日志里会周期性地出现 PERC 电池电量低的告警，随后又自行恢复正常。本文记录这次告警的排查过程、DELL 官方的解释，以及最终的核实结论，供遇到同类报错时参考。

## 报错现象

iDRAC 日志中的报错信息如下：

```text
Sun Jul 06 2025 07:24:49	The PERC1 battery is operating normally.
Sun Jul 06 2025 06:50:13	The PERC1 battery is low.
Mon Apr 07 2025 04:22:23	The PERC1 battery is operating normally.
Mon Apr 07 2025 04:20:18	The PERC1 battery is low.
```

报错内容为 PERC 电量低，随后又恢复正常，错误复现周期为 3 个月。

## 原因分析

查询发现 DELL 官方文档有记录[《了解 PERC 电池错误》](https://www.dell.com/support/kbdoc/zh-cn/000351229/poweredge-%E4%BA%86%E8%A7%A3-perc-%E7%94%B5%E6%B1%A0%E9%94%99%E8%AF%AF#bat15)，其中《充电问题示例》中的报错疑似与该报错一致，但报错循环周期不同。

查询后了解到 PERC 是 DELL 阵列卡的电池，也就是俗称的 RAID 卡的 BBU（Battery Backup Unit），而其中每三个月复现一次的该报错为 DELL PERC 的正常循环充放电操作，属于正常现象。

## 结论

PERC 每 3 个月重复报错 `The PERC1 battery is low.`，随后恢复 `The PERC1 battery is operating normally.`。

该报错为 RAID 卡 BBU 电池的充放电报错，每 3 个月为周期的循环报错是 DELL 的自检行为，属于正常现象。

> [!NOTE] 已核实
> **2025-9-4 已致电 DELL 800-858-0613 核实，该信息可信**
