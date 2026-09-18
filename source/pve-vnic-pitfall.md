在 Proxmox VE 里给 QEMU 虚拟机配网卡时，限速相关的设置让我踩过一次大坑。这里先记一下推荐的网卡配置，再说说这个坑的来龙去脉和填坑办法。

## 网卡推荐设置

qemu 的虚拟机网卡推荐设置如下：关闭防火墙，使用 VirtIO 半虚拟化，Multiqueue 根据 vCPU 数量填写，4 核则是 4，超过 8 核最大值只能是 8。

![20240626193051](https://img.hackerbs.com//20240626193051.png)

## 此处记录一个大坑

qemu 虚拟机网卡的限速功能，会导致传输大量小包时延迟巨大，比如 steam 下载游戏，会导致延迟巨高，甚至飙升到 300ms。

本次大坑的发现过程相当曲折，[粒子GO](https://lizigo.cn)的用户在购买服务器后，steamcmd 下载游戏时会延迟巨高，很卡，随后针对机房防火墙、交换机性能、线路问题进行了全面排查后，了解到 steam 下载会使用小包传输以保障完整性，而虚拟机服务器正好需要进行限速，导致流量在宿主机转发了一遍再传到虚拟机，一旦遇到 steam 下载这种大量小包传输，便会导致延迟巨高。

## 填坑办法

取消在宿主机设置虚拟机网卡限速，直接在虚拟机系统里做限速，以下是在 Debian 使用 `iproute2` 的 `tc` 进行限速的办法：

```bash
# 初始化enp6s18,设置默认的根qdisc,然后删除
tc qdisc add dev enp6s18 root handle 1: fq_codel
tc qdisc del dev enp6s18 root
# 设置根队列规则
tc qdisc add dev enp6s18 root handle 1: htb default 10
# 创建一个类来限制上行带宽为30Mbps
tc class add dev enp6s18 parent 1: classid 1:1 htb rate 30mbit
# 创建过滤器将所有上行流量命中该类
tc filter add dev enp6s18 protocol ip parent 1: prio 1 u32 match ip src 0.0.0.0/0 flowid 1:1

# 查询enp6s18网卡规则
tc qdisc show dev enp6s18
# 查询enp6s18网卡类规则
tc class show dev enp6s18
# 查询enp6s18网卡过滤器
tc filter show dev enp6s18

# 一条龙梭哈
tc qdisc add dev enp6s18 root handle 1: fq_codel && tc qdisc del dev enp6s18 root && tc qdisc add dev enp6s18 root handle 1: htb default 10 && tc class add dev enp6s18 parent 1: classid 1:1 htb rate 30mbit && tc filter add dev enp6s18 protocol ip parent 1: prio 1 u32 match ip src 0.0.0.0/0 flowid 1:1
```
