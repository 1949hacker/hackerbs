---
title: 关于磁盘残留lvm的解决办法
date: '2024-11-28 10:28:48'
tags:
  - Linux
  - lvm
  - 磁盘
  - 解决办法
  - dmsetup
aliases:
  - 关于磁盘残留lvm的解决办法
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/关于磁盘残留lvm的解决办法.md
---

> [!info] 知识位置
> 体系: 存储与数据可靠性体系
> 层级: 排障
> 前置知识: [[datacentre/os/linux-tips|Linux技巧【持续更新】]]
> 原始来源: `source/_posts/关于磁盘残留lvm的解决办法.md`
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

很多时候从其他机器拿过来的盘通常是没有经过格式化的，这样就会出现一些残留的lvm信息，导致无法正常使用。

出现该残留lvm的原因是因为设备映射器device mapper正在管理该磁盘，所以wipefs -a -f和dd if=/dev/zero of=/dev/disk命令无法清除该lvm

```shell
# lsblk显示如下
nvme0n1					disk
└storage-data			lvm

# ls -l /dev/mapper查询device mapper管理的磁盘信息
lrwxrwxrwx 1 root root 		7 Nov 28 18:04 storage-data ->../dm-0

#dmsetup remove删除
dmsetup remove /dev/mapper/storage-data
```
