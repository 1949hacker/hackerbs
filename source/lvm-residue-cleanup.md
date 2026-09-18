从其他机器上拿过来的盘通常没有经过格式化，直接使用时常常会发现残留的 LVM 信息，导致盘无法正常使用。本文记录一次清除磁盘残留 LVM 的过程。

## 现象与原因

很多时候从其他机器拿过来的盘通常是没有经过格式化的，这样就会出现一些残留的 LVM 信息，导致无法正常使用。

出现该残留 LVM 的原因是因为设备映射器 device mapper 正在管理该磁盘，所以 `wipefs -a -f` 和 `dd if=/dev/zero of=/dev/disk` 命令无法清除该 LVM。

## 解决办法

`lsblk` 显示如下：

```text
nvme0n1        disk
└storage-data  lvm
```

用 `ls -l /dev/mapper` 查询 device mapper 管理的磁盘信息：

```text
lrwxrwxrwx 1 root root 7 Nov 28 18:04 storage-data ->../dm-0
```

用 `dmsetup remove` 删除：

```bash
dmsetup remove /dev/mapper/storage-data
```
