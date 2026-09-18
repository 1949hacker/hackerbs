带外报出 SSD 故障告警，过一会儿又自己恢复正常，这种情况到底要不要紧？本文记录一次 INTEL SSD 告警自行恢复的排查过程，并整理出几个常见的故障原因推测与对应的 SMART 检查项。

## 故障现象

日常巡检时发现带外出现 INTEL SSD 故障告警，随后又自行恢复，间隔约 30 分钟，无人工介入。

## 排障思路

用 `smartctl -a /dev/sda` 查看硬盘的 SMART 信息，按下表逐项核对：

| 故障原因推测 | 排障思路 |
|---|---|
| 硬盘背板接触问题 | 检查 smartctl 中 `ID 199 UltraDMA CRC Error Count` 的值，是否存在 CRC 校验错误 |
| NAND 闪存寿命是否不足 | 检查 smartctl 中 `ID 233 Media Wearout Indicator` 的值 |
| 是否存在坏扇区 | 检查 smartctl 中 `ID 5 Reallocated sector ct` 的值 |
| 硬盘备用空间是否不足 | 检查 smartctl 中 `ID 232 Available Reservd space` 的值 |

实例：

```text
Media Wearout Indicator: 当前值0 临界值100 - 健康
Reallocated Sector Count: 当前值0 临界值75 - 健康
Available Reservd Spare: 当前值0 临界值100 - 健康
```
