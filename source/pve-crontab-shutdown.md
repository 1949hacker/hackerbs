PVE 宿主机需要定时批量关闭或依次启动所有虚拟机时，不必一台台手动操作。直接用一行命令从 `qm list` 取出 VMID 再循环处理即可，本文记录把这两条命令直接写进 crontab 的做法。

## 依次关机

```bash
# 依次关机
i=$(qm list)&&vmid=$(echo "$i" | awk '{if (NR>1) {print $1}}')&&for i in $vmid;do qm shutdown $i;done
```

## 依次开机（间隔一分钟）

```bash
#依次开机，间隔一分钟
i=$(qm list)&&vmid=$(echo "$i" | awk '{if (NR>1) {print $1}}')&&for i in $vmid;do qm start $i&&sleep 60s;done
```
