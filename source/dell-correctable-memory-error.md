巡检 DELL PowerEdge 服务器时，iDRAC 报出内存设备的可纠正内存错误日志记录已禁用的告警。本文以 DELL PowerEdge R740XD 为例，记录该报错的核实过程与官方解释，说明它是否影响使用。

## 报错现象

> [!NOTE] 巡检发现
> iDRAC 报错 `Correctable memory error logging disabled for a memory`

## 原因说明

致电 800-858-0613 核实 BIOS 固件版本低于 2.10，固件过旧，属于遗留问题。

关于该报错的解释为：BIOS 关闭了对于 ECC 纠错记录的保存，仅仅是没有记录进行了 ECC 纠错，实际上并不影响使用，可能存在的风险为：无法知晓 ECC 进行了多少次纠错。

> [!NOTE] 已核实
> **2025-9-4 已致电 DELL 800-858-0613 核实，该信息可信**
